const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o-pro?ask=${encodeURIComponent(message)}&uid=1`);
    res.json({ response: response.data.response });
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ response: "Erreur de communication avec l'API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
