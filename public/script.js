const controlBtn = document.getElementById("controlBtn");
const typingIndicator = document.getElementById("typingIndicator");
const toggleChat = document.getElementById("toggleChat");
const chatBox = document.getElementById("chatBox");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");

let recognition;
let isListening = false;
let isBotSpeaking = false;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "fr-FR";
    recognition.maxAlternatives = 1;
    recognition.noiseSuppression = true; 

    let silenceTimeout;

    recognition.onstart = () => {
        if (!isBotSpeaking) {
            typingIndicator.style.display = "block";
            controlBtn.textContent = "⏹️ Arrêter";
            isListening = true;
            clearTimeout(silenceTimeout);
        }
    };

    recognition.onresult = async (event) => {
        typingIndicator.style.display = "none";
        const transcript = event.results[0][0].transcript;
        addMessage("Vous", transcript);

        disableMic(); // Désactiver le micro

        const response = await fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: transcript }),
        }).then(res => res.json());

        addMessage("Bot", response.response);
        await speak(response.response, recognition.lang);

        enableMic(); // Réactiver le micro après la réponse
    };

    recognition.onerror = (event) => {
        console.error("Erreur:", event.error);
    };

    recognition.onspeechend = () => {
        silenceTimeout = setTimeout(() => {
            recognition.stop(); 
        }, 3000);
    };

    recognition.onend = () => {
        if (isListening && !isBotSpeaking) {
            setTimeout(() => recognition.start(), 300); // Réactivation ultra rapide
        } else {
            controlBtn.textContent = "🎤 Démarrer";
        }
    };

    controlBtn.addEventListener("click", () => {
        if (isListening) {
            isListening = false;
            recognition.stop();
        } else {
            isListening = true;
            recognition.start();
        }
    });
}

toggleChat.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;

    addMessage("Vous", message);
    chatInput.value = "";

    fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    })
    .then(res => res.json())
    .then(data => {
        addMessage("Bot", data.response);
        speak(data.response, navigator.language);
    });
}

function addMessage(sender, message) {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    saveChat();
}

function speak(text, lang) {
    return new Promise((resolve) => {
        isBotSpeaking = true;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onend = () => {
            isBotSpeaking = false;
            resolve();
        };
        speechSynthesis.speak(utterance);
    });
}

function disableMic() {
    if (recognition && isListening) {
        recognition.stop();
    }
}

function enableMic() {
    if (!isBotSpeaking && isListening) {
        recognition.start();
    }
}

function saveChat() {
    localStorage.setItem("chatHistory", chatMessages.innerHTML);
}

function loadChat() {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
        chatMessages.innerHTML = savedChat;
    }
}

loadChat();
