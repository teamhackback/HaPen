module services.issues;

import hb;
import vibe.db.mongo.mongo;

import controllers.user : AuthInfo, authenticate;

import std.array;
import std.algorithm;
import std.conv;
import std.datetime : DateTime;

@safe:

@path("/issues") @requiresAuth!authenticate
class Issues
{
    MongoCollection m_issues;

    this(MongoDatabase db)
    {
        m_issues = db["issues"];
    }

    @noAuth {
        auto index()
        {
            //return m_issues.find(Bson.emptyObject).map!(deserializeBson!Offer).array;
            return m_issues.find(Bson.emptyObject).map!(deserializeBson!Json).array;
        }

        auto get(BsonObjectID _issueId)
        {
            Json json;
            if (auto b = m_issues.findOne(["aid": _issueId]))
                json = b.deserializeBson!Json;
            return json;
        }
    }

    @anyAuth
    @path("/:issueId/take")
    auto put(string _issueId, AuthInfo auth)
    {
        import std.datetime : Clock, DateTime;

        if (auto b = m_issues.findOne(["aid": _issueId]))
        {
            if (!b.tryIndex("takenBy").isNull) {
                enforceHTTP(0, HTTPStatus.forbidden, "Invalid item");
            }
            Bson set;
            set["takenAt"] = BsonDate(Clock.currTime);
            set["takeBy"] = auth.userId;
            m_issues.update(["aid": _issueId], [
                "$set": set
            ]);
        }
        enforceHTTP(0, HTTPStatus.forbidden, "Invalid item");
    }
}
