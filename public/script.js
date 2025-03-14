document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const typingIndicator = document.getElementById("typing-indicator");

    // Fonction pour ajouter un message dans le chat
    function addMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.textContent = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Fonction pour envoyer une requête à l'API
    async function sendMessage(message) {
        addMessage(`Moi: ${message}`, "user");
        typingIndicator.style.display = "block";

        try {
            const response = await fetch("/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            typingIndicator.style.display = "none";
            addMessage(`Bot: ${data.reply}`, "bot");
            speakText(data.reply);
        } catch (error) {
            typingIndicator.style.display = "none";
            addMessage("Erreur de connexion avec le serveur.", "bot");
        }
    }

    // Reconnaissance vocale automatique
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const message = lastResult[0].transcript.trim();
        userInput.value = message;
        sendMessage(message);
    };

    recognition.start();

    // Fonction pour lire la réponse du bot
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        speechSynthesis.speak(utterance);
    }

    // Envoyer un message quand on appuie sur "Entrée"
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage(userInput.value);
            userInput.value = "";
        }
    });

    // Envoyer un message avec le bouton
    sendBtn.addEventListener("click", () => {
        sendMessage(userInput.value);
        userInput.value = "";
    });
});
