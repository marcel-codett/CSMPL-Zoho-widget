import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  try {
    // Retrieve token from Redis
    const cachedToken = await redis.get("auth_token");
    const tokenExpiry = await redis.get("token_expiry");

    if (cachedToken && tokenExpiry && tokenExpiry > Date.now()) {
      console.log("Returning cached token from Redis:", "cachedToken");
      return Response.json({ token: cachedToken });
    }

    console.log("Token expired. Fetching a new one...");

    // Fetch a new token
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!authResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to authenticate" }), {
        status: 500,
      });
    }

    const authData = await authResponse.json();
    const newToken = authData.token;

    // Store token in Redis with an expiration of 13 minutes
    await redis.set("auth_token", newToken, { ex: 780 });
    await redis.set("token_expiry", Date.now() + 13 * 60 * 1000);

    console.log("New token stored in Redis:", "newToken");

    return Response.json({ token: newToken });
  } catch (error) {
    console.error("Token fetch failed:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch token" }), {
      status: 500,
    });
  }
}
