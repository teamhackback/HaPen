module models.user;

import vibe.data.bson : BsonObjectID;

struct User
{
    import vibe.data.serialization : dbName = name;
    @dbName("_id") BsonObjectID id;
    string email;
    string name;
    long githubId;
    string avatarUrl;
}
