import vibe.data.json;
import vibe.http.client : HTTPClientRequest, requestHTTP;
import vibe.http.common : HTTPMethod;
import vibe.http.server : HTTPServerRequest, HTTPServerResponse;
import vibe.stream.operations : readAllUTF8;

string hookSecret;

shared static this()
{
    import std.process : environment;
    hookSecret = environment["APP_GITHUB_HOOK_SECRET"];
}

void githubHook(HTTPServerRequest req, HTTPServerResponse res)
{
    auto json = verifyRequest(req.headers["X-Hub-Signature"], req.bodyReader.readAllUTF8);
    switch (req.headers["X-GitHub-Event"])
    {
    case "ping":
        return res.writeBody("pong");
    case "status":
        return res.writeBody("handled");
    case "pull_request":
        return res.writeBody("pr");
    default:
        return res.writeVoidBody();
    }
}

auto ghSendRequest(T...)(HTTPMethod method, string url, T arg)
    if (T.length <= 1)
{
    return ghSendRequest((scope req) {
        req.method = method;
        static if (T.length)
            req.writeJsonBody(arg);
    }, url);
}

//==============================================================================
// Github hook signature
//==============================================================================

auto getSignature(string data)
{
    import std.digest.digest, std.digest.hmac, std.digest.sha;
    import std.string : representation;

    import std.stdio;
    hookSecret.writeln;
    auto hmac = HMAC!SHA1(hookSecret.representation);
    hmac.put(data.representation);
    return hmac.finish.toHexString!(LetterCase.lower);
}

Json verifyRequest(string signature, string data)
{
    import std.exception : enforce;
    import std.string : chompPrefix;

    import std.stdio;
    getSignature(data).writeln;
    enforce(getSignature(data) == signature.chompPrefix("sha1="),
            "Hook signature mismatch");
    return parseJsonString(data);
}
