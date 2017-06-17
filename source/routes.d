import vibe.http.router : URLRouter;
import vibe.data.json : Json;

void registerAppRoutes(scope URLRouter router)
{
    import std.process : environment;
    import hb.web.rest : registerRestInterface;
    import hb.web.web : registerWebInterface;
    import vibe.db.mongo.mongo : connectMongoDB;

    with(router) {
        get("/api/session", (req, res) {
            if (req.session.isKeySet("user"))
                res.writeJsonBody(req.session.get!Json("user"));
            else
                res.writeBody("Empty Session");
        });
        get("/", (req, res) {
            res.writeBody("Hello Scalingo.");
        });
    }

    auto host = environment.get("APP_MONGO_URL", "mongodb://localhost");
    auto dbName = environment.get("APP_MONGO_DB", "hackback");
    auto db = connectMongoDB(host).getDatabase(dbName);

    // TODO: how to initialize controllers?
    import controllers.user : UserController, users;
    users = new UserController(db);

    import services.offers : Offers;

    import hb.web.web : registerWebInterface, WebInterfaceSettings;
    auto userServiceSettings = new WebInterfaceSettings();
    userServiceSettings.urlPrefix = "/api";
    userServiceSettings.ignoreTrailingSlash = true; // true: overloads for trailing /
    router.registerWebInterface(new Offers(db), userServiceSettings);
}
