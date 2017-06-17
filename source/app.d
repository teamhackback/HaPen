import vibe.d;

// the usual friends
import std.algorithm, std.range;
import std.stdio;

shared static this()
{
    import oauthimpl : registerOAuth, isLoggedIn;
    import routes : registerAppRoutes;
    import settings : loadSettings;

    import vibe.core.log;
    setLogLevel(LogLevel.info);

    auto router = new URLRouter;

    router.get("/api/user/logout", (scope req, scope res) {
        res.terminateSession();
        // TODO: for some reason writeVoidBody doesn't send the response directly
        //res.writeVoidBody;
        res.writeBody("Logged out");
    });

    // inject the current user into the frontend
    router.get("/api/user/json", (req, res) {
        import oauthimpl : webapp;
        import models.user : User;
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

    router.registerOAuth;
    router.registerAppRoutes();

    /*
    // frontend
    router.get("*", serveStaticFiles("frontend/build"));

    // default pages
    router.any("/api/*", delegate void(scope HTTPServerRequest req, scope HTTPServerResponse res) {
        res.statusCode = 401;
        res.writeBody("Invalid API route");
    });
    router.get("*", serveStaticFile("frontend/build/index.html"));
    */

    HTTPClient.setUserAgentString("Awesome D");
    listenHTTP(loadSettings, router);

    //foreach (route; router.getAllRoutes)
    //{
        //if ([HTTPMethod.POST, HTTPMethod.GET, HTTPMethod.PUT].canFind(route.method))
            //logDebug("%s: %s", route.pattern, route.method);
    //}
}
