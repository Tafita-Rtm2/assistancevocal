const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.post("/ask", async (req, res) => {
    const question = req.body.question;
    try {
        const response = await fetch(`http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(question)}`);
        const data = await response.json();
        const reply = data.answer || "Je ne sais pas quoi dire.";
        res.json({ answer: reply });
    } catch (error) {
        res.json({ answer: "Erreur de connexion à l'API." });
    }
});

app.listen(3000, () => console.log("✅ Serveur démarré sur http://localhost:3000"));
