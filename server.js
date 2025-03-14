const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const GEMINI_API_KEY = "AIzaSyBrLBVavqMAb5HweYh_slRTwL11bdUbz8w"; // Remplace par ta clé API

app.post("/ask", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
            { prompt: { text: message } }
        );

        const reply = response.data.candidates[0]?.output || "Je n'ai pas compris.";
        res.json({ response: reply });
    } catch (error) {
        console.error("Erreur API Gemini:", error);
        res.status(500).json({ response: "Erreur avec l'IA." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
