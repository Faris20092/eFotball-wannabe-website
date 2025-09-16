const express = require("express");
const fetch = require("node-fetch"); // untuk call API Discord
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Config session (supaya user login info boleh simpan sementara)
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: true,
}));

// Root page
app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(`
      <h1>✅ Welcome, ${req.session.user.username}#${req.session.user.discriminator}</h1>
      <p>You are logged in with Discord OAuth!</p>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>⚽ Football Web</h1>
      <p>Login with Discord to manage your squad!</p>
      <a href="/login">Login with Discord</a>
    `);
  }
});

// Login → redirect ke Discord
app.get("/login", (req, res) => {
  const redirect = encodeURIComponent(process.env.CALLBACK_URL);
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`
  );
});

// Callback OAuth
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("❌ No code provided!");

  // Tukar code jadi access token
  const params = new URLSearchParams();
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.CALLBACK_URL);
  params.append("scope", "identify");

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const tokenData = await tokenResponse.json();

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();

    // Simpan user dalam session
    req.session.user = userData;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("❌ Login failed!");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
