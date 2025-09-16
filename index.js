const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.send("⚽ Hello Football Website is running on Railway!");
});

// Discord OAuth callback route
app.get("/callback", (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("❌ No code provided");
  }
  // Sementara: just tunjuk balik code
  res.send(`✅ OAuth Callback received! Code: ${code}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
