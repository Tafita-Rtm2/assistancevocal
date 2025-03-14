document.getElementById("start-btn").addEventListener("click", startListening);
document.getElementById("chat-icon").addEventListener("click", () => {
    document.getElementById("chat-box").style.display = "block";
});

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "fr-FR";
recognition.continuous = false;

function startListening() {
    recognition.start();
    recognition.onresult = async (event) => {
        let message = event.results[0][0].transcript;
        addMessage("Moi", message);
        getBotResponse(message);
    };
}

async function getBotResponse(question) {
    document.getElementById("typing-indicator").style.display = "block";
    let response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });
    let data = await response.json();
    document.getElementById("typing-indicator").style.display = "none";
    addMessage("Bot", data.answer);
    speakText(data.answer);
}

function addMessage(sender, text) {
    let messages = document.getElementById("messages");
    let messageElement = document.createElement("div");
    messageElement.classList.add("message", sender === "Moi" ? "user" : "bot");
    messageElement.textContent = sender + ": " + text;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

function speakText(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    speechSynthesis.speak(utterance);
}

function sendMessage() {
    let input = document.getElementById("user-input");
    let message = input.value;
    if (message.trim() !== "") {
        addMessage("Moi", message);
        getBotResponse(message);
        input.value = "";
    }
}
