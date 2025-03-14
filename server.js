const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_URL = "https://zetbot-page.onrender.com/api/gemini";

app.post("/ask", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.get(`${API_URL}?prompt=${encodeURIComponent(message)}&uid=1`);
        let reply = response.data.description || "Je n'ai pas compris.";

        // Suppression des astérisques et mise en gras du texte encadré par ** **
        reply = reply.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*/g, "");

        res.json({ response: reply });
    } catch (error) {
        console.error("Erreur API :", error);
        res.status(500).json({ response: "Erreur avec l'IA." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
