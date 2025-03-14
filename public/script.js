const startBtn = document.getElementById("startBtn");
const typingIndicator = document.getElementById("typingIndicator");
const toggleChat = document.getElementById("toggleChat");
const chatBox = document.getElementById("chatBox");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");

let recognition;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "fr-FR"; // Détection automatique de la langue
    let silenceTimeout;

    recognition.onstart = () => {
        typingIndicator.style.display = "block";
        clearTimeout(silenceTimeout);
    };

    recognition.onresult = async (event) => {
        typingIndicator.style.display = "none";
        const transcript = event.results[0][0].transcript;
        addMessage("Vous", transcript);
        
        fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: transcript }),
        })
        .then(res => res.json())
        .then(data => {
            addMessage("Bot", data.response);
            speak(data.response, recognition.lang);
        });
    };

    recognition.onerror = (event) => {
        console.error("Erreur reconnaissance vocale:", event.error);
    };

    recognition.onspeechend = () => {
        silenceTimeout = setTimeout(() => {
            recognition.stop();  // Arrête après 3 secondes de silence
        }, 3000);
    };

    recognition.onend = () => {
        setTimeout(() => recognition.start(), 1000);
    };

    startBtn.addEventListener("click", () => {
        recognition.start();
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
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
