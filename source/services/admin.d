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
    MongoCollection m_prs;

    this(MongoDatabase db)
    {
        m_prs = db["pull_requests"];
        m_issues = db["issues"];
    }

    @anyAuth
    auto get()
    {
        import std.stdio;
        import github : ApiIssue;
        string[] repoSlugs = ["sorin-ionescu/prezto", "eHaPen/amazing-repo", "dlang/dub", "dlang/dub-registry",
                              "rejectedsoftware/vibe.d", "gnunn1/tilix", "dlang-tour/core", "ldc-developers/ldc",
                              "rmarquis/pacaur", "libmir/mir", "dlang-community/dscanner", "neovim/neovim",
                              "PhilippeSigaud/Pegged", "dlang-community/DCD"];

        // reset everything before
        m_prs.drop();
        m_issues.drop();

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
