module services.issues;

import hb;
import vibe.db.mongo.mongo;

import controllers.user : AuthInfo, authenticate;

import std.array;
import std.algorithm;
import std.conv;
import std.datetime : DateTime;
import std.range;

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
        auto index(HTTPServerRequest req)
        {
            Bson filter = Bson.emptyObject;
            if (auto search = "search" in req.query)
            {
                auto searchQuery = Bson([
                    "$regex": Bson(".*" ~ *search ~".*"),
                    "$options": Bson("i")
                ]);
                import std.ascii : isDigit;
                Bson numeric = Bson.emptyObject;
                if ((*search).all!isDigit)
                    numeric = Bson(["blob.number": Bson((*search).to!long)]);
                Bson or = [Bson(["blob.body": searchQuery]), Bson(["blob.title": searchQuery]), numeric];
                filter["$or"] = or;
            }
            return m_issues.find(filter).map!(deserializeBson!Json).take(15).array;
        }

        auto get(string _issueId)
        {
            Json json;
            auto b = m_issues.findOne(["aid": _issueId]);
            if (b.length > 0)
                json = b.deserializeBson!Json;
            return json;
        }
    }

    @anyAuth
    @path("/:issueId/take")
    auto get(string _issueId, AuthInfo auth)
    {
        import std.datetime : Clock, DateTime;

        import std.stdio;
        writeln("_issueId: ", _issueId);
        auto b = m_issues.findOne(["aid": _issueId]);
        writeln(b.length);
        if (b.length > 0)
        {
            if (!b.tryIndex("takenBy").isNull) {
                enforceHTTP(0, HTTPStatus.badRequest, "already assigned");
            }
            Bson set = Bson.emptyObject;
            set["takenAt"] = BsonDate(Clock.currTime);
            set["takenBy"] = auth.userId;
            m_issues.update(["aid": _issueId], [
                "$set": set
            ]);
        } else {
            enforceHTTP(0, HTTPStatus.notFound, "Invalid item");
        }
        return "ok";
    }
}
