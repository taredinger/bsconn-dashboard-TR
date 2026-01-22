import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const HUGHESON_BASE = "https://api.hugheson.net/pulse/v1";

const USERNAME = process.env.HUGHESON_USER;
const PASSWORD = process.env.HUGHESON_PASS;

let cachedToken = null;
let tokenExpiresAt = 0;

// 🔐 Login helper
async function login() {
  const response = await fetch(`${HUGHESON_BASE}/login/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  console.log("Authenticated with HughesOn");
}

// 🔹 Assets endpoint (auto-login if needed)
app.get("/api/assets", async (req, res) => {
  try {
    if (!cachedToken || Date.now() >= tokenExpiresAt) {
      console.log("No valid token, logging in...");
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
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
