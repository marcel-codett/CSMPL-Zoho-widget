import { NextResponse } from "next/server";

let cachedToken = null;
let tokenExpiry = null; // Store token expiration time

export async function POST() {
  const currentTime = Date.now();

  // If token exists and hasn't expired, return it
  if (cachedToken && tokenExpiry && currentTime < tokenExpiry) {
    return Response.json({ token: cachedToken });
  }

  // If no valid token, fetch a new one
  try {
    const username = "ADMIN";
    const password = "remote++23";
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await fetch(
      "https://selfservice.radixpension.com/wildfly/pensionserver-web/rest/partnerservice/auth/login",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    // Extract token from headers
    const authHeader = response.headers.get("authorization");

    if (!authHeader) {
      throw new Error("Authorization token not found in response headers");
    }

    // Store the token and its expiration (15 minutes)
    cachedToken = authHeader.replace("Bearer ", "");
    tokenExpiry = currentTime + 15 * 60 * 1000; // 15 minutes in milliseconds

    return Response.json({ token: cachedToken });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
