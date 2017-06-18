import vibe.data.json;
import vibe.http.client : HTTPClientRequest, requestHTTP;
import vibe.http.common : HTTPMethod;
import vibe.http.server : HTTPServerRequest, HTTPServerResponse;
import vibe.stream.operations : readAllUTF8;
import std.datetime;
import std.format;
import std.array;
import std.algorithm;
import std.string;
import std.stdio;
import vibe.core.log;
import vibe.core.core : runTask;
import std.functional : toDelegate;
import std.string : replace;

import std.algorithm;
import std.conv : text, to;
import std.typecons;

string hookSecret;
string botToken;
string githubAPIURL = "https://api.github.com";
string botName = "hapen1";

import vibe.data.bson : Bson, BsonObjectID, serializeToBson;
import vibe.db.mongo.mongo : MongoCollection;
import vibe.db.mongo.database : MongoDatabase;
import vibe.db.mongo.flags : UpdateFlags, IndexFlags;

shared static this()
{
    import std.process : environment;
    hookSecret = environment["APP_GITHUB_HOOK_SECRET"];
    botToken = "token " ~ environment["APP_GITHUB_BOT_TOKEN"];
}

static struct ApiIssue {
    BsonObjectID _id;
    Bson[] events;
    Bson blob;
    string apid;
    enum Status {closed, open}
    Status status;
    DateTime takenAt;
    double value = 0;
    ApiPullRequest[] pullRequests;
}
static struct ApiPullRequest {
    BsonObjectID _id;
    string apid;
    Bson[] events;
}

class GitHub
{
    MongoCollection m_issues;
    MongoCollection m_prs;
    this(MongoDatabase mongoDB)
    {
        m_issues = mongoDB["issues"];
        m_prs = mongoDB["pull_requests"];
	    m_issues.ensureIndex([tuple("aid", 1)], IndexFlags.Unique);
	    m_prs.ensureIndex([tuple("aid", 1)], IndexFlags.Unique);
    }

    void hook(HTTPServerRequest req, HTTPServerResponse res)
    {
        import std.stdio;
        auto json = verifyRequest(req.headers["X-Hub-Signature"], req.bodyReader.readAllUTF8);
        auto eventType = req.headers["X-GitHub-Event"];
        logInfo("Receiving %s from GH", eventType);
        switch (eventType)
        {
        case "ping":
            return res.writeBody("pong");
        case "status":
            return res.writeBody("handled");
        case "issue_comment":
            return res.writeBody("ok");
        case "issues":
            //auto issue = json["issue"].deserializeJson!Issue;
            logDebug("Issue#%s with action:%s", json["issue"]["number"], json["action"]);
            storeIssue(json);
                //runTask((&updateComment!Issue).toDelegate, &issue);
            return res.writeBody("handled");
        case "pull_request":
            auto action = json["action"].get!string;
            logDebug("PR#%s with action:%s", json["number"], action);
            switch (action)
            {
                case "unlabeled", "closed", "opened", "reopened", "synchronize", "labeled", "edited":
                    auto pr = json["pull_request"].deserializeJson!PullRequest;
                    storePR(json, pr);
                    pr.updateComment;
                    pr.workWithPR;
                    return res.writeBody("handled");
                default:
                    return res.writeBody("ignored");
            }
        default:
            return res.writeVoidBody();
        }
    }

    void storeIssue(Json json)
    {
        logInfo("Sorting info");
        auto id = text(json["repository"]["full_name"].get!string.replace("/", "_"), "_", json["issue"]["number"]);


        m_issues.update(["aid": id], [
            "$push":  [
                "events": json
            ]
        ], UpdateFlags.upsert);
    }

    void storePR(Json json, PullRequest pr)
    {
        auto id = text(pr.repoSlug.replace("/", "_"), "_", pr.number);
        Bson b = Bson.emptyObject;
        b["sha"] = pr.head.sha;
        b["blob"] = json;
        m_prs.update(["aid": id], [
            "$set":  b
        ], UpdateFlags.upsert);

        import std.regex;
        static re = regex(`(((close|resolve)(s|d)?)|fix(e(s|d))?) #(\d)+`, "i");
        pr.commits().map!((c){
            return matchFirst(c.commit.message, re);
        }).filter!(m => !m.empty).map!((m) {
            return m.back.to!long;
        }).map!((issue) {
            return text(pr.repoSlug.replace("/", "_"), "_", issue);
        }).each!((aid) {
            m_issues.update(["aid": aid], [
                "$push":  [
                    "events": b
                ]
            ]);
        });
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
        req.headers["Authorization"] = botToken;
        static if (T.length)
            req.writeJsonBody(arg);
    }, url);
}

auto getBotComment(R)(in ref R r)
{
    Nullable!GHComment comment;
    auto res = ghGetRequest(r.commentsURL)
        .readJson[]
        .find!(c => c["user"]["login"] == botName);
    if (res.length)
        comment = deserializeJson!GHComment(res[0]);
    return comment;
}

void updateComment(R)(R r)
{
    auto comment = r.getBotComment();
    string msg = "Hello world" ~ Clock.currTime.toString();
    if (comment.isNull) {
        GHComment.post(r, msg);
    } else {
        logInfo("Comment: %s", comment);
        comment.update(msg);
    }
}

void workWithPR(PullRequest pr)
{
    GHCiStatus status = {
        state : GHCiStatus.State.success,
        description: "Awesome PR!",
        targetUrl: "https://hapen.hackback.tech",
        context: "hapen"
    };
    logInfo("Sending status to GH: %s", status);
    pr.addStatus(status);
}

//==============================================================================
// Fill DB with random issues
//==============================================================================

private struct AllPages
{
    private string url;
    private string link = "next";

    // does not cache
    auto front() {
        scope req = ghGetRequest(url);
        link = req.headers.get("Link");
        return req.readJson[];
    }

    void popFront()
    {
        import std.utf : byCodeUnit;
        url = link[1..$].byCodeUnit.until(">").array;
    }
    bool empty()
    {
        return !link.canFind("next");
    }
    
    typeof(this) save() {
        return this;
    }
}

auto ghGetAllPages(string url)
{
    return AllPages(url);
}

//==============================================================================
// Github API objects
//==============================================================================

struct Issue
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
    enum State { open, closed }
    @byName State state;

    uint number;
    string title;
    @name("created_at") SysTime createdAt;
    @name("updated_at") SysTime updatedAt;
    bool locked;

    @name("repository_url")
    string repositoryUrl;
    string repoSlug() const {
        import std.range, std.algorithm, std.string;
        return repositoryUrl[$ - repositoryUrl.representation.retro.splitter('/').take(2).joiner.walkLength - 1 .. $];
    }

    GHUser user;
    Nullable!GHUser assignee;
    GHUser[] assignees;

    bool isOpen() const { return state == State.open; }

    string htmlURL() const { return "https://github.com/%s/issues/%d".format(repoSlug, number); }
    string commentsURL() const { return "%s/repos/%s/issues/%d/comments".format(githubAPIURL, repoSlug, number); }
    string eventsURL() const { return "%s/repos/%s/issues/%d/events".format(githubAPIURL, repoSlug, number); }
    string labelsURL() const { return "%s/repos/%s/issues/%d/labels".format(githubAPIURL, repoSlug, number); }

    GHComment[] comments() const {
        return ghGetRequest(commentsURL)
                .readJson
                .deserializeJson!(GHComment[]);
    }
}



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

    void addStatus(GHCiStatus status)
    {
        auto url = "%s/repos/%s/statuses/%s".format(githubAPIURL, repoSlug, head.sha);
        ghSendRequest(HTTPMethod.POST, url, status);
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

    static void post(R)(in ref R r, string msg)
    {
        ghSendRequest(HTTPMethod.POST, r.commentsURL, ["body" : msg]);
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
