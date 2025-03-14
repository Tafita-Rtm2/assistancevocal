const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const apiUrl = `http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(userMessage)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.answer) {
            res.json({ reply: response.data.answer });
        } else {
            res.json({ reply: "Désolé, je n'ai pas compris." });
        }
    } catch (error) {
        console.error("Erreur API:", error);
        res.status(500).json({ reply: "Erreur de connexion avec le serveur." });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
