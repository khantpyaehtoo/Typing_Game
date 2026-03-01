const textDisplay = document.getElementById("text-display");
const userInput = document.getElementById("user-input");

// Global Variables
let startTime;
let timeRunning = false;
let intervalId;
let currentLevel = "medium";

// --- ၁။ API Fetch Logic ---
const fetchApi = async (lvl) => {
    try {
        const res = await fetch(`http://localhost:3001/${lvl}`);
        const data = await res.json();
        return data[Math.floor(Math.random() * data.length)].text;
    } catch (error) {
        console.error("error at fetching api", error);
    }
};

const initGame = async (lvl = "medium") => {
    const data = await fetchApi(lvl);
    if (data) {
        textDisplay.innerHTML = "";
        userInput.value = ""; // စာဟောင်းတွေ ရှင်းမယ်
        data.split("").forEach((char) => {
            const span = document.createElement("span");
            span.innerText = char;
            textDisplay.appendChild(span);
        });
    }
};

function updateStats() {
    if (!startTime) return;

    const currentTime = new Date();
    const timeInSeconds = Math.floor((currentTime - startTime) / 1000);
    const timeInMinutes = timeInSeconds / 60;
    const totalChars = userInput.value.length;

    if (timeInSeconds >= 60) {
        showResult();
        return;
    }

    if (timeInSeconds > 0 && totalChars > 0) {
        const wpm = Math.round(totalChars / 5 / timeInMinutes);
        document.getElementById("display-wpm").innerText = wpm;
        document.getElementById("display-timer").innerText = timeInSeconds;
    }
}

function showResult() {
    clearInterval(intervalId);
    userInput.disabled = true;

    const wpm = document.getElementById("display-wpm").innerText;
    const accuracy = document.getElementById("display-accuracy").innerText;
    const quoteLen = textDisplay.querySelectorAll("span").length;

    document.getElementById("final-wpm").innerText = wpm;
    document.getElementById("best-wpm").innerText = wpm;
    document.getElementById("final-accuracy").innerText = accuracy;
    document.getElementById("final-cha").innerText = quoteLen;

    document.getElementById("result-modal").classList.remove("hidden");
}

function resetStats() {
    clearInterval(intervalId); // Timer အဟောင်းရပ်မယ်
    timeRunning = false;
    startTime = null;
    userInput.disabled = false;
    userInput.value = "";
    document.getElementById("display-accuracy").innerText = "100";
    document.getElementById("display-wpm").innerText = "0";
    document.getElementById("display-timer").innerText = "0";
}

// Level Buttons
let diffBtns = document.querySelectorAll(".diff-btns");
diffBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        diffBtns.forEach((b) => b.classList.remove("clicked"));
        btn.classList.add("clicked");
        currentLevel = btn.innerText.toLowerCase();
        resetStats();
        initGame(currentLevel);
    });
});

// Restart Button
document.getElementById("re-btn").addEventListener("click", () => {
    document.getElementById("result-modal").classList.add("hidden");
    resetStats();
    initGame(currentLevel);
});

// Input Logic
userInput.addEventListener("input", () => {
    const quote = textDisplay.querySelectorAll("span");
    const value = userInput.value.split("");

    // Start Timer on first character
    if (!timeRunning && value.length > 0) {
        startTime = new Date();
        timeRunning = true;
        intervalId = setInterval(updateStats, 1000);
    }

    let currentCorrect = 0;
    quote.forEach((charSpan, index) => {
        const char = value[index];
        if (char == null) {
            charSpan.classList.remove("correct", "incorrect");
        } else if (char === charSpan.innerText) {
            charSpan.classList.add("correct");
            charSpan.classList.remove("incorrect");
            currentCorrect++;
        } else {
            charSpan.classList.add("incorrect");
            charSpan.classList.remove("correct");
        }
    });

    // Accuracy
    if (value.length > 0) {
        const accuracy = Math.floor((currentCorrect / value.length) * 100);
        document.getElementById("display-accuracy").innerText = accuracy;
    }

    // End of Quote Check
    if (value.length === quote.length) {
        showResult();
    }
});

// Initial Focus & Game Start
document.addEventListener("click", () => userInput.focus());
initGame();
