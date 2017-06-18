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
            //auto issue = m_issues.findOne!Issue(["_id": _issueId]);
            //enforceHTTP(!offer.isNull, notFound);
            //return offer.get;
            return "a";
        }
    }

    @anyAuth
    @path("/:offerId/take")
    auto put(string _offerId, AuthInfo auth)
    {
        return "b" ~ _offerId.to!string ~ ":" ~ auth.userId;
    }

    @anyAuth
    @path("/:offerId/take")
    auto get(string _offerId, AuthInfo auth)
    {
        return "b" ~ _offerId.to!string ~ ":" ~ auth.userId;
    }

	//@anyAuth
    //auto post(Offer offer) @system
    //{
        //offer.id = BsonObjectID.generate();
        //m_offers.insert(offer);
        //status = 201;
        //return offer;
    //}
}
