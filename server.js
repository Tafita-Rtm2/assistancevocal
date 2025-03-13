const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/ask", async (req, res) => {
    const { question } = req.body;

    try {
        const response = await fetch(`http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(question)}`);
        const data = await response.json();
        const reply = data.answer || "Je ne sais pas quoi dire.";

        res.json({ answer: reply });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
