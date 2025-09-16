const express = require("express");
const app = express();
const PORT = 3000;

// Route basic
app.get("/", (req, res) => {
  res.send("Hello Football Website! ⚽🔥");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Server is online and ready! ⚡');
});
