import vibe.http.router : URLRouter;
import vibe.data.json : Json;
import vibe.core.log;

void registerAppRoutes(scope URLRouter router)
{
    import std.process : environment;
    import hb.web.rest : registerRestInterface;
    import hb.web.web : registerWebInterface;
    import vibe.db.mongo.mongo : connectMongoDB;
    import vibe.db.mongo.settings : MongoClientSettings, MongoAuthMechanism, parseMongoDBUrl;

    with(router) {
        get("/api/session", (req, res) {
            if (req.session.isKeySet("user"))
                res.writeJsonBody(req.session.get!Json("user"));
            else
                res.writeBody("Empty Session");
        });
        get("/", (req, res) {
            res.writeBody("Hello Scalingo...");
        });

        get("/api/github_hook", (req, res) {
            logInfo("GH-req: %s", req);
        });
    }

    // TODO: parse mongo url properly here
    MongoClientSettings mongoSettings;
    auto mongoUrl = environment.get("APP_MONGO_URL", "mongodb://localhost/hapen");
    logInfo("Mongo.Connect: %s", mongoUrl);
    parseMongoDBUrl(mongoSettings, mongoUrl);

    logInfo("Mongo.database: %s", mongoSettings.database);
    logInfo("Mongo.hosts: %s", mongoSettings.hosts);
    logInfo("Mongo.username: %s", mongoSettings.username);
    logInfo("Mongo.digest: %s", mongoSettings.digest);
    // scramSHA1
    mongoSettings.authMechanism = MongoAuthMechanism.scramSHA1;

    auto mongoInstance = connectMongoDB(mongoSettings);
    logInfo("Mongo.Instance: %s", mongoSettings.database);
    auto mongoDB = mongoInstance.getDatabase(mongoSettings.database);

    // TODO: how to initialize controllers?
    import controllers.user : UserController, users;
    logInfo("User");
    users = new UserController(mongoDB);

    import services.offers : Offers;

    import hb.web.web : registerWebInterface, WebInterfaceSettings;
    logInfo("User2");
    auto userServiceSettings = new WebInterfaceSettings();
    logInfo("User3");
    userServiceSettings.urlPrefix = "/api";
    logInfo("User4");
    userServiceSettings.ignoreTrailingSlash = true; // true: overloads for trailing /
    logInfo("User4");
    router.registerWebInterface(new Offers(mongoDB), userServiceSettings);
    logInfo("User5");
}
