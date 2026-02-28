const textDisplay = document.getElementById("text-display");
const userInput = document.getElementById("user-input");

let diffBtns = document.querySelectorAll(".diff-btns");
diffBtns.forEach((diffBtn) => {
    diffBtn.addEventListener("click", (e) => {
        e.preventDefault();

        diffBtns.forEach((b) => b.classList.remove("clicked"));
        diffBtn.classList.add("clicked");

        let currLvl = diffBtn.innerText.toLowerCase();
        initGame(currLvl);
        resetStats();
    });
});

let modeBtns = document.querySelectorAll(".mode-btn");
modeBtns.forEach((modeBtn) => {
    modeBtn.addEventListener("click", (e) => {
        e.preventDefault();

        modeBtns.forEach((b) => b.classList.remove("clicked"));
        modeBtn.classList.add("clicked");
    });
});

const fetchApi = async (lvl) => {
    try {
        const res = await fetch(`http://localhost:3001/${lvl}`);
        const data = await res.json();

        const randomIndex = Math.floor(Math.random() * data.length);
        const randomQuote = data[randomIndex];

        console.log(randomQuote);
        return randomQuote.text;
    } catch (error) {
        console.error("error at fetching api", error);
    }
};

const initGame = async (d = "medium") => {
    const data = await fetchApi(d);
    if (data) {
        textDisplay.innerHTML = "";
        data.split("").forEach((char) => {
            const span = document.createElement("span");
            span.innerText = char;
            textDisplay.appendChild(span);
        });
    }
};

initGame();

document.addEventListener("click", () => userInput.focus());

// accuarcy
let totalTyped = 0;
let correctTyped = 0;

// wpm
let startTime;
let timeRunning = false;
let intervalId;
userInput.addEventListener("input", () => {
    // e.preventDefault();
    const quote = textDisplay.querySelectorAll("span");
    const value = userInput.value.split("");

    let currentCorrect = 0;
    let currentTotal = value.length;

    quote.forEach((charSpan, index) => {
        const char = value[index];
        if (char == null) {
            charSpan.classList.remove("correct");
            charSpan.classList.remove("incorrect");
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
    if (currentTotal > 0) {
        const accuracy = Math.floor((currentCorrect / currentTotal) * 100);
        document.getElementById("display-accuracy").innerText = `${accuracy}`;
    } else {
        document.getElementById("display-accuracy").innerText = "100";
    }

    // Wpm
    if (!timeRunning && userInput.value.length > 0) {
        startTime = new Date();
        timeRunning = true;

        intervalId = setInterval(updateStats, 1000);
    }

    function updateStats() {
        if (!startTime) return;

        const currentTime = new Date();
        const timeInSeconds = Math.floor((currentTime - startTime) / 1000);
        const timeInMinutes = timeInSeconds / 60;

        const totalChars = userInput.value.length;

        if (timeInSeconds >= 60) {
            userInput.disabled = true;
        }

        if (timeInSeconds > 0 && totalChars > 0) {
            const wordsCount = totalChars / 5;
            const wpm = Math.round(wordsCount / timeInMinutes);

            document.getElementById("display-wpm").innerText = wpm;
            document.getElementById("display-timer").innerText = timeInSeconds;
        }
    }
});

function resetStats() {
    document.getElementById("display-accuracy").innerText = "100";
}
