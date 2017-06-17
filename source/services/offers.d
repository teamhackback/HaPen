module services.offers;

import hb;
import vibe.db.mongo.mongo;

import controllers.user : AuthInfo, authenticate;

import std.array;
import std.algorithm;
import std.datetime : DateTime;

@safe:

enum State { available, closed}

struct Offer {
    @optional @name("_id") BsonObjectID id;

    State state;
    string item;
    DateTime date;
    int quanitity;
    string description;
    int originalPrice;
    int offeredPrice;
    DateTime expiryDate;

    double lat;
    double lng;

    @optional Image[] images;
}

struct Image {
    import std.base64 : Base64;
    ubyte[] image;
    static Image fromString(string img) {
        return Image(Base64.decode(img));
    }
    string toString() {
        return Base64.encode(image);
    }
}

@path("/offers") @requiresAuth!authenticate
class Offers
{
    MongoCollection m_offers;

    this(MongoDatabase db)
    {
        m_offers = db["offers"];
    }

    @noAuth {
        auto index()
        {
            return m_offers.find(Bson.emptyObject).map!(deserializeBson!Offer).array;
        }

        auto get(BsonObjectID _offerId)
        {
            auto offer = m_offers.findOne!Offer(["_id": _offerId]);
            enforceHTTP(!offer.isNull, notFound);
            return offer.get;
        }
    }

    @anyAuth
    auto getB(string _offerId, AuthInfo auth)
    {
        return "b" ~ _offerId ~ ":" ~ auth.userId;
    }

	@anyAuth
    auto post(Offer offer) @system
    {
        offer.id = BsonObjectID.generate();
        m_offers.insert(offer);
        status = 201;
        return offer;
    }

}

@path("/stores") @requiresAuth!authenticate
class Stores
{
    MongoCollection m_stores;

    this(MongoDatabase db)
    {
        m_stores = db["stores"];
    }

    auto get() {
        return m_stores.find(Bson.emptyObject).map!(deserializeBson!Offer).array;
    }

    auto get(int _storeId) {
        auto store = m_stores.findOne!Offer(["_id": _storeId]);
        enforceHTTP(!store.isNull, notFound);
        return store.get;
    }
}
