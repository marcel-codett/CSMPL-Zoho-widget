let cachedToken = null;
let tokenExpiry = null;

export async function GET() {
  console.log("Token expiry:", tokenExpiry, "Current time:", Date.now());

  // Check if token is still valid
  if (cachedToken && tokenExpiry && tokenExpiry > Date.now()) {
    console.log("Returning cached token:", cachedToken);
    return Response.json({ token: cachedToken });
  }

  console.log("Token expired. Fetching a new one...");

  // Fetch new token
  try {
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
    cachedToken = authData.token; // Store the token in memory
    tokenExpiry = Date.now() + 13 * 60 * 1000; // Set expiry to 14 minutes

    console.log("New token fetched:", cachedToken);

    return Response.json({ token: cachedToken });
  } catch (error) {
    console.error("Token fetch failed:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch token" }), {
      status: 500,
    });
  }
}
