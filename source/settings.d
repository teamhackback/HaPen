import vibe.http.server : HTTPServerOption, HTTPServerSettings;

HTTPServerSettings loadSettings()
{
    import std.process : environment;
    import vibe.core.core : workerThreadCount;
    import vibe.core.args : readOption;
    import vibe.db.redis.sessionstore : RedisSessionStore;
    import std.stdio;
    import std.conv : to;

    bool debugMode = true;

    auto settings = new HTTPServerSettings;
    settings.port = environment.get("APP_PORT", "8080").to!ushort;
    settings.bindAddresses = ["0.0.0.0"];
    settings.options = HTTPServerOption.defaults
                    & ~HTTPServerOption.parseJsonBody;

    writefln("workers: %d", workerThreadCount);
    if (!debugMode)
        settings.options &= ~HTTPServerOption.errorStackTraces;

    //settings.sessionStore = new MemorySessionStore;
    auto redisUrl = environment.get("APP_REDIS_URL", "localhost");
    long redisDB = environment.get("APP_REDIS_DB", "0").to!long;
    settings.sessionStore = new RedisSessionStore(redisUrl, redisDB);
    settings.sessionIdCookie = "hackback.session_id";
    settings.serverString = "hackback.d/0.1";
    readOption("port|p", &settings.port, "Sets the port used for serving.");

    return settings;
}
