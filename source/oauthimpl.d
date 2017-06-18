import oauth.settings : OAuthSettings;
import oauth.webapp : OAuthWebapp;

import std.stdio;

import vibe.http.router : URLRouter;
import vibe.http.client : requestHTTP;
import vibe.http.server : HTTPServerRequest, HTTPServerResponse;
import vibe.data.json : Json;
import vibe.core.log;

OAuthWebapp webapp;
immutable(OAuthSettings) githubOAuthSettings;
string finalRedirectUri;

/++
Load OAuth configuration from environment variables.
+/
auto loadFromEnvironment(
    string providerName,
    string envPrefix,
    string redirectUri,
)
{
    import std.process : environment;
    string clientId = environment[envPrefix ~ "_CLIENTID"];
    string clientSecret = environment[envPrefix ~ "_CLIENTSECRET"];

    return new immutable(OAuthSettings)(
        providerName,
        clientId,
        clientSecret,
        redirectUri);
}

shared static this()
{
    import oauth.provider.github;
    import oauth.provider.google;
    import std.process : environment;

    webapp = new OAuthWebapp;

    // oauth stuff
    // TODO: make callback uri configureable
    githubOAuthSettings = loadFromEnvironment("github", "GITHUB_OAUTH", "http://localhost:8080/api/user/login/github");

    //finalRedirectUri = environment.get("APP_FRONTEND_ROOT", "/");
    finalRedirectUri = "/";
}

string[] githubScopes = ["user:email"];

import models.user : User;
import controllers.user : users;

bool isLoggedIn(scope HTTPServerRequest req) @safe {
    if (webapp.isLoggedIn(req, githubOAuthSettings))
        if (req.session && req.session.isKeySet("user"))
            return true;
    return false;
    //if (!req.session)
        //return false;


    //return false;
}

void registerOAuth(scope URLRouter router)
{
    router.get("/api/session", (req, res) {
        if (req.session && req.session.isKeySet("user"))
            res.writeJsonBody(req.session.get!Json("user"));
        else
            res.writeBody("Empty Session");
    });

    router.get("/api/user/logout", (scope req, scope res) {
        res.terminateSession();
        // TODO: for some reason writeVoidBody doesn't send the response directly
        //res.writeVoidBody;
        res.redirect(finalRedirectUri);
    });

    // inject the current user into the frontend
    router.get("/api/user/json", (req, res) {
        import oauthimpl : webapp;
        import models.user : User;
        import vibe.data.json : serializeToJsonString;
        res.headers["Content-Type"] = "application/javascript";
        if (isLoggedIn(req))
        {
            auto user = req.session.get!User("user");
            res.bodyWriter.write("var SESSION_USER = ");
            res.bodyWriter.write(user.serializeToJsonString);
            res.bodyWriter.write(";");
        }
        else
        {
            res.writeBody("var SESSION_USER = false;");
        }
    });

    router.get("/api/user/login/error", (req, res) {
        res.writeBody("An error happened");
    });

    router.get("/api/user/login/github", (req, res) {
        // TODO: necessary?
        if (isLoggedIn(req))
        {
            logInfo("Already logged in- redirecting to final page.");
            return res.redirect(finalRedirectUri);
        }
        else if (webapp.login(req, res, githubOAuthSettings, githubScopes))
        {
            //if (!isLoggedIn(req))
            //{
                //logInfo("Error happened");
                //res.writeBody("Error happened");
            //}
            auto session = webapp.oauthSession(req);
            assert (session, "No session: authenticate() not called??");

            writeln("requesting users");
            requestHTTP(
                "https://api.github.com/user",
                delegate (scope githubReq) {
                    githubReq.headers["Accept"] = "application/vnd.github.v3+json";
                    session.authorizeRequest(githubReq);
                },
                delegate (scope githubRes) {
                    auto userInfo = githubRes.readJson();

                    // TODO: join requests!
                    requestHTTP(
                        "https://api.github.com/user/emails",
                        delegate (scope githubReq) {
                            githubReq.headers["Accept"] = "application/vnd.github.v3+json";
                            session.authorizeRequest(githubReq); },
                        delegate (scope emailRes) {
                            auto userEmail = emailRes.readJson();

                            import vibe.http.common : enforceBadRequest;
                            enforceBadRequest(userEmail.length >= 1, "At least one email expected");

                            User user = {
                                name: userInfo["name"].get!string,
                                email: userEmail[0]["email"].get!string,
                                avatarUrl: userInfo["avatar_url"].get!string,
                                githubId: userInfo["id"].get!long,
                            };
                            user = users.loginOrSignup!"githubId"(user);
                            req.session.set("user", user);

                            assert(isLoggedIn(req));
                            res.redirect(finalRedirectUri);
                        });
                });
        }
    });
}
