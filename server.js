const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.post("/ask", async (req, res) => {
    const question = req.body.question;
    console.log("🔵 Question reçue:", question);

    try {
        const response = await fetch(`http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(question)}`);
        const data = await response.json();
        
        console.log("🟢 Réponse brute de l'API:", data);

        if (data.answer) {
            res.json({ answer: data.answer });
        } else {
            res.json({ answer: "Je n'ai pas de réponse à cette question." });
        }
    } catch (error) {
        console.error("❌ Erreur API:", error);
        res.json({ answer: "Erreur de connexion à l'API." });
    }
});

app.listen(3000, () => console.log("✅ Serveur démarré sur http://localhost:3000"));
