const typingIndicator = document.querySelector(".typing-indicator");
const chatContainer = document.getElementById("chatContainer");
const chatBox = document.getElementById("chatBox");
const textInput = document.getElementById("textInput");
const sendTextBtn = document.getElementById("sendText");
const toggleChatBtn = document.getElementById("toggleChat");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "fr-FR";
recognition.continuous = false;
recognition.interimResults = false;

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
        recognition.start();
    };
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
        addMessage("Moi", question);
        addMessage("Bot", data.answer);
        saveChat("Moi", question);
        saveChat("Bot", data.answer);
    })
    .catch(error => {
        console.error("Erreur :", error);
        typingIndicator.style.display = "none";
    });
}

function addMessage(author, message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = `${author}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

recognition.onresult = (event) => {
    let question = event.results[0][0].transcript;
    askBot(question);
};

recognition.start();

sendTextBtn.addEventListener("click", () => {
    let question = textInput.value.trim();
    if (question) {
        askBot(question);
        textInput.value = "";
    }
});

toggleChatBtn.addEventListener("click", () => {
    chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
});
