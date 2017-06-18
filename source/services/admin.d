module services.admin;

import hb;
import std.string;
import std.algorithm;
import vibe.db.mongo.mongo;
import controllers.admin : authenticate;

string githubAPIURL = "https://api.github.com";

@path("/filldb") @requiresAuth!authenticate
class Admin
{
    MongoCollection m_issues;

    this(MongoDatabase db)
    {
        MongoCollection m_prs = db["pull_requests"];
        m_issues = db["issues"];

        m_prs.drop();
        m_issues.drop();
    }

    @anyAuth
    auto get()
    {
        import std.stdio;
        import github : ApiIssue;
        string[] repoSlugs = ["sorin-ionescu/prezto"];

        foreach (i, repoSlug; repoSlugs)
        {
            import github : ghGetAllPages;
            import std.stdio;
            import vibe.db.mongo.mongo;
            import std.range;
            import std.conv : text;

            auto pages = ghGetAllPages(
                "%s/repos/%s/issues?state=open&direction=desc"
                .format(githubAPIURL, repoSlug));

            foreach (issue; pages.joiner.filter!(a => "pull_request" !in a))
            {
                auto aid = text(repoSlug.replace("_", "/"), "_", issue["number"]);
                m_issues.update(["aid": aid], [
                    "$set":  [
                        "blob": issue
                    ]
                ], UpdateFlags.upsert);
            }
        }

        return "ok";
    }
}
