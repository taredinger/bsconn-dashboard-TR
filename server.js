import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const HUGHESON_BASE = "https://api.hugheson.net/pulse/v1";

// Credentials from environment variables
const USERNAME = process.env.HUGHESON_USER;
const PASSWORD = process.env.HUGHESON_PASS;

let cachedToken = null;

// 🔐 LOGIN
app.post("/api/login", async (req, res) => {
  try {
    console.log("INCOMING: POST /api/login");

    const response = await fetch(`${HUGHESON_BASE}/login/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      console.error("LOGIN FAILED:", data);
      return res.status(401).json({ error: "Login failed" });
    }

    cachedToken = data.access_token;
    console.log("TOKEN SAVED");

    res.json({ success: true });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📦 FETCH ASSETS
app.get("/api/assets", async (req, res) => {
  try {
    console.log("INCOMING: GET /api/assets");

    if (!cachedToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const response = await fetch(
      `${HUGHESON_BASE}/assets/customer?filters={"state":"1","managementIp":"00"}`,
      {
        headers: {
          Authorization: `Bearer ${cachedToken}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("ASSET FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 START SERVER (LOCAL + AZURE)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
