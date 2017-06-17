import vibe.d;

// the usual friends
import std.algorithm, std.range;
import std.stdio;

shared static this()
{
    import oauthimpl : registerOAuth;
    import routes : registerAppRoutes;
    import settings : loadSettings;

    import vibe.core.log;
    setLogLevel(LogLevel.info);

    auto router = new URLRouter;

    router.registerOAuth;
    router.registerAppRoutes();

    // frontend
    router.get("*", serveStaticFiles("frontend/build"));

    // default pages
    router.any("/api/*", delegate void(scope HTTPServerRequest req, scope HTTPServerResponse res) {
        res.statusCode = 401;
        res.writeBody("Invalid API route");
    });
    router.get("*", serveStaticFile("frontend/build/index.html"));

    HTTPClient.setUserAgentString("Awesome D");
    listenHTTP(loadSettings, router);

    foreach (route; router.getAllRoutes)
    {
        if ([HTTPMethod.POST, HTTPMethod.GET, HTTPMethod.PUT].canFind(route.method))
            logDebug("%s: %s", route.pattern, route.method);
    }
}
