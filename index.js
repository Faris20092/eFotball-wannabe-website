const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Football Web API ⚽🔥 is running!");
});

// ⚠️ Railway bagi PORT sendiri, so jangan hardcode
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
