module controllers.admin;

import vibe.http.server : HTTPServerRequest, HTTPServerResponse;
import std.string;

string adminToken;

shared static this()
{
    import std.process : environment;
    adminToken = environment["APP_ADMIN_TOKEN"];
}

struct AuthInfo {
    bool admin;
	bool isAdmin() { return this.admin; }
}

AuthInfo authenticate(HTTPServerRequest req, HTTPServerResponse res)
{
    import std.stdio;
    import vibe.http.common : HTTPStatusException;
    import vibe.http.status : HTTPStatus;

    if (auto tok = "adminToken" in req.query)
    {
        if (*tok == adminToken)
        {
            return AuthInfo(true);
        }
    }

    throw new HTTPStatusException(HTTPStatus.forbidden, "Not authorized to perform this action!");
}
