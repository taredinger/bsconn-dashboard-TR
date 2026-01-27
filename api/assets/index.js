import fetch from "node-fetch";

const HUGHESON_BASE = "https://api.hugheson.net/pulse/v1";

let cachedToken = null;
let tokenExpiresAt = 0;

async function login() {
  const response = await fetch(`${HUGHESON_BASE}/login/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.HUGHESON_USER,
      password: process.env.HUGHESON_PASS,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
}

export default async function (context, req) {
  try {
    if (!cachedToken || Date.now() >= tokenExpiresAt) {
      await login();
    }

    const response = await fetch(
      `${HUGHESON_BASE}/assets/customer?filters={"state":"1","managementIp":"00"}`,
      {
        headers: {
          Authorization: `Bearer ${cachedToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Asset fetch failed");
    }

    const data = await response.json();

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message },
    };
  }
}
