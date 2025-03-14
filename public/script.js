function addMessage(sender, message, isUser = false) {
    const chat = document.getElementById("chat");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(isUser ? "user-message" : "bot-message");
    msgDiv.innerText = sender + ": " + message;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
    let input = document.getElementById("user-input");
    let question = input.value.trim();
    if (!question) return;

    addMessage("Moi", question, true);
    input.value = "";

    document.getElementById("typing-indicator").style.display = "block";

    try {
        let response = await fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        let data = await response.json();
        console.log("🟢 Réponse reçue:", data);

        document.getElementById("typing-indicator").style.display = "none";

        if (data.answer) {
            addMessage("Bot", data.answer);
            speakText(data.answer);
        } else {
            addMessage("Bot", "Je n'ai pas de réponse.");
        }
    } catch (error) {
        console.error("❌ Erreur:", error);
        addMessage("Bot", "Erreur de connexion.");
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// 🎤 Fonction pour lire la réponse en vocal
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Détection automatique de la langue
    const detectedLang = detectLanguage(text);
    utterance.lang = detectedLang;
    
    speechSynthesis.speak(utterance);
}

// 🌎 Détection automatique de la langue
function detectLanguage(text) {
    const frenchWords = ["bonjour", "salut", "merci"];
    const englishWords = ["hello", "thank", "yes"];
    const spanishWords = ["hola", "gracias", "sí"];

    if (frenchWords.some(word => text.toLowerCase().includes(word))) return "fr-FR";
    if (englishWords.some(word => text.toLowerCase().includes(word))) return "en-US";
    if (spanishWords.some(word => text.toLowerCase().includes(word))) return "es-ES";
    
    return "fr-FR"; // Par défaut, en français
}
