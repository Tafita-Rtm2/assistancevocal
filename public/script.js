const startVoiceBtn = document.getElementById("startVoice");
const typingIndicator = document.querySelector(".typing-indicator");
const textInput = document.getElementById("textInput");
const sendTextBtn = document.getElementById("sendText");
const chatBox = document.querySelector(".chat-box");
const toggleChatBtn = document.getElementById("toggleChat");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "fr-FR";
recognition.continuous = false;
recognition.interimResults = false;

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    speechSynthesis.speak(utterance);
}

function askBot(question) {
    typingIndicator.style.display = "block";

    fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
        typingIndicator.style.display = "none";
        speakText(data.answer);
        saveChat("Moi", question);
        saveChat("Bot", data.answer);
    })
    .catch(error => {
        console.error("Erreur :", error);
        typingIndicator.style.display = "none";
    });
}

startVoiceBtn.addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = (event) => {
    let question = event.results[0][0].transcript;
    askBot(question);
};

recognition.onend = () => {
    typingIndicator.style.display = "none";
};

sendTextBtn.addEventListener("click", () => {
    let question = textInput.value.trim();
    if (question) {
        askBot(question);
        textInput.value = "";
    }
});

toggleChatBtn.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
});

function saveChat(author, message) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ author, message });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

window.onload = () => {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(chat => {
        console.log(`${chat.author}: ${chat.message}`);
    });
};
