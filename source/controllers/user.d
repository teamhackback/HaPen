module controllers.user;

import models.user : User;
import vibe.db.mongo.mongo;
import std.typecons : tuple;

// TLS instance
UserController users;

class UserController
{
    MongoCollection m_users;

    this(MongoDatabase db)
    {
        m_users = db["users"];

        //m_users.ensureIndex([tuple("name", 1)], IndexFlags.unique);
        m_users.ensureIndex([tuple("googleId", 1)], IndexFlags.unique | IndexFlags.sparse);
    }

    //User getUserById(string id)
    //{
        //auto user = m_users.findOne(["id": id]);
        //enforce(!user.isNull, "Unknown user");
        //return user.deserializeBson!User;
    //}

    User loginOrSignup(string providerId)(User user)
    {
        auto u = m_users.findOne!User([providerId: mixin("user." ~ providerId)]);
        if (!u.isNull)
        {
            // TODO: should we update attributes?
            return u.get;
        }
        else
        {
            return addUser(user);
        }
    }

    User addUser(User user)
    {
        user.id  = BsonObjectID.generate();
        m_users.insert(user);
        return user;
    }

    void updateToken(string id, string token)
    {
        m_users.update(["id": id], ["$set": token]);
    }
}

@safe:

import vibe.http.server : HTTPServerRequest, HTTPServerResponse;

struct AuthInfo {
	string userId;
    bool premium;
    bool admin;
	bool isAdmin() { return this.admin; }
	bool isPremiumUser() { return this.premium; }
}

AuthInfo authenticate(HTTPServerRequest req, HTTPServerResponse res)
{
    import models.user : User;
    import oauthimpl : isLoggedIn;
    import std.conv : to;
    import vibe.http.common : HTTPStatusException;
    import vibe.http.status : HTTPStatus;

    if (!isLoggedIn(req)) throw new HTTPStatusException(HTTPStatus.forbidden, "Not authorized to perform this action!");
    auto user = req.session.get!User("user");
    return AuthInfo(user.id.to!string);
}
