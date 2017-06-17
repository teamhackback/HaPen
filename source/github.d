import vibe.data.json;
import vibe.http.client : HTTPClientRequest, requestHTTP;
import vibe.http.common : HTTPMethod;
import vibe.http.server : HTTPServerRequest, HTTPServerResponse;
import vibe.stream.operations : readAllUTF8;
import std.datetime;
import std.format;
import vibe.core.log;
import vibe.core.core : runTask;
import std.functional : toDelegate;

string hookSecret;
string botToken;
string githubAPIURL = "https://api.github.com";

shared static this()
{
    import std.process : environment;
    hookSecret = environment["APP_GITHUB_HOOK_SECRET"];
    botToken = environment["APP_GITHUB_BOT_TOKEN"];
}

void githubHook(HTTPServerRequest req, HTTPServerResponse res)
{
    import std.stdio;
    auto json = verifyRequest(req.headers["X-Hub-Signature"], req.bodyReader.readAllUTF8);
    switch (req.headers["X-GitHub-Event"])
    {
    case "ping":
        return res.writeBody("pong");
    case "status":
        return res.writeBody("handled");
    case "pull_request":
        auto action = json["action"].get!string;
        logDebug("#%s %s", json["number"], action);

        switch (action)
        {
            case "unlabeled", "closed", "opened", "reopened", "synchronize", "labeled", "edited":
                auto pr = json["pull_request"].deserializeJson!PullRequest;
                // runTask!
                runTask((&updateGithubComment).toDelegate, &pr);
                return res.writeBody("handled");
            default:
                return res.writeBody("ignored");
        }
    default:
        return res.writeVoidBody();
    }
}

auto ghGetRequest(string url)
{
    return requestHTTP(url, (scope req) {
        req.headers["Authorization"] = botToken;
    });
}

auto ghGetRequest(scope void delegate(scope HTTPClientRequest req) userReq, string url)
{
    return requestHTTP(url, (scope req) {
        req.headers["Authorization"] = botToken;
        userReq(req);
    });
}

auto ghSendRequest(scope void delegate(scope HTTPClientRequest req) userReq, string url)
{
    HTTPMethod method;
    requestHTTP(url, (scope req) {
        req.headers["Authorization"] = botToken;
        userReq(req);
        method = req.method;
    }, (scope res) {
        if (res.statusCode / 100 == 2)
        {
            logInfo("%s %s, %s\n", method, url, res.statusPhrase);
            res.bodyReader.readAllUTF8;
        }
        else
            logWarn("%s %s failed;  %s %s.\n%s", method, url,
                res.statusPhrase, res.statusCode, res.bodyReader.readAllUTF8);
    });
}

auto ghSendRequest(T...)(HTTPMethod method, string url, T arg)
    if (T.length <= 1)
{
    return ghSendRequest((scope req) {
        req.method = method;
        static if (T.length)
            req.writeJsonBody(arg);
    }, url);
}

void updateGithubComment(PullRequest* pr)
{
    //comment.remove();
    //comment.post(pr, "Hello world");
}

//==============================================================================
// Github API objects
//==============================================================================

struct PullRequest
{
    import std.typecons : Nullable;

    static struct Repo
    {
        @name("full_name") string fullName;
    }
    static struct Branch
    {
        string sha;
        Repo repo;
    }
    Branch base, head;
    enum State { open, closed }
    enum MergeableState { clean, dirty, unstable, unknown }
    @byName State state;
    uint number;
    string title;
    @optional Nullable!bool mergeable;
    @optional @byName Nullable!MergeableState mergeable_state;
    @name("created_at") SysTime createdAt;
    @name("updated_at") SysTime updatedAt;
    bool locked;

    GHUser user;
    Nullable!GHUser assignee;
    GHUser[] assignees;

    string baseRepoSlug() const { return base.repo.fullName; }
    string headRepoSlug() const { return head.repo.fullName; }
    alias repoSlug = baseRepoSlug;
    bool isOpen() const { return state == State.open; }

    string htmlURL() const { return "https://github.com/%s/pull/%d".format(repoSlug, number); }
    string commentsURL() const { return "%s/repos/%s/issues/%d/comments".format(githubAPIURL, repoSlug, number); }
    string commitsURL() const { return "%s/repos/%s/pulls/%d/commits".format(githubAPIURL, repoSlug, number); }
    string eventsURL() const { return "%s/repos/%s/issues/%d/events".format(githubAPIURL, repoSlug, number); }
    string labelsURL() const { return "%s/repos/%s/issues/%d/labels".format(githubAPIURL, repoSlug, number); }
    string reviewsURL() const { return "%s/repos/%s/pulls/%d/reviews".format(githubAPIURL, repoSlug, number); }
    string mergeURL() const { return "%s/repos/%s/pulls/%d/merge".format(githubAPIURL, repoSlug, number); }
    string statusURL() const { return "%s/repos/%s/status/%s".format(githubAPIURL, repoSlug, head.sha); }

    GHComment[] comments() const {
        return ghGetRequest(commentsURL)
                .readJson
                .deserializeJson!(GHComment[]);
    }
    GHCommit[] commits() const {
        return ghGetRequest(commitsURL)
                .readJson
                .deserializeJson!(GHCommit[]);
    }
    GHReview[] reviews() const {
        return ghGetRequest((scope req) {
            // custom media type is required during preview period:
            // preview review api: https://developer.github.com/changes/2016-12-14-reviews-api
            req.headers["Accept"] = "application/vnd.github.black-cat-preview+json";
        }, reviewsURL)
            .readJson
            .deserializeJson!(GHReview[]);
    }
    GHCiStatus[] status() const {
        return ghGetRequest(statusURL)
                .readJson["statuses"]
                .deserializeJson!(GHCiStatus[]);
    }

    void postMerge(in ref GHMerge merge) const
    {
        ghSendRequest((scope req){
            req.method = HTTPMethod.PUT;
            // custom media type is required during preview period:
            // https://developer.github.com/changes/2016-09-26-pull-request-merge-api-update/
            req.headers["Accept"] = "application/vnd.github.polaris-preview+json";
            req.writeJsonBody(merge);
        }, mergeURL);
    }
}

static struct GHUser
{
    string login;
    ulong id;
}

struct GHComment
{
    @name("created_at") SysTime createdAt;
    @name("updated_at") SysTime updatedAt;
    GHUser user;
    string body_;
    string url;

    static void post(in ref PullRequest pr, string msg)
    {
        ghSendRequest(HTTPMethod.POST, pr.commentsURL, ["body" : msg]);
    }

    void update(string msg) const
    {
        ghSendRequest(HTTPMethod.PATCH, url, ["body" : msg]);
    }

    void remove() const
    {
        if (url.length) // delete any existing comment
            ghSendRequest(HTTPMethod.DELETE, url);
    }
}

struct GHReview
{
    GHUser user;
    @name("commit_id") string commitId;
    string body_;
    enum State { APPROVED, CHANGES_REQUESTED, COMMENTED }
    @byName State state;
}

struct GHCommit
{
    string sha;
    static struct CommitAuthor
    {
        string name;
        string email;
        SysTime date;
    }
    static struct Commit
    {
        CommitAuthor author;
        CommitAuthor committer;
        string message;
    }
    Commit commit;
    GHUser author;
    GHUser committer;
}

struct GHCiStatus
{
    enum State { success, error, failure, pending }
    @byName State state;
    string description;
    @name("target_url") string targetUrl;
    string context; // "CyberShadow/DAutoTest", "Project Tester",
                    // "ci/circleci", "auto-tester", "codecov/project",
                    // "codecov/patch", "continuous-integration/travis-ci/pr"
}

enum MergeMethod { none = 0, merge, squash, rebase }

struct GHMerge
{
    @name("commit_message") string commitMessage;
    string sha;
    @name("merge_method") @byName MergeMethod mergeMethod;
}

//==============================================================================
// Github hook signature
//==============================================================================

auto getSignature(string data)
{
    import std.digest.digest, std.digest.hmac, std.digest.sha;
    import std.string : representation;

    import std.stdio;
    auto hmac = HMAC!SHA1(hookSecret.representation);
    hmac.put(data.representation);
    return hmac.finish.toHexString!(LetterCase.lower);
}

Json verifyRequest(string signature, string data)
{
    import std.exception : enforce;
    import std.string : chompPrefix;

    enforce(getSignature(data) == signature.chompPrefix("sha1="),
            "Hook signature mismatch");
    return parseJsonString(data);
}
