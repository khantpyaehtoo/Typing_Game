const textDisplay = document.getElementById("text-display");
const userInput = document.getElementById("user-input");

const hard = "http://localhost:3001/hard";

const text = "The archaeological expedition unearthed artifacts that";
text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);
});

document.addEventListener("click", () => userInput.focus());

userInput.addEventListener("input", () => {
    const quote = textDisplay.querySelectorAll("span");
    const value = userInput.value.split("");

    quote.forEach((charSpan, index) => {
        const char = value[index];
        if (char == null) {
            charSpan.classList.remove("correct");
            charSpan.classList.remove("incorrect");
        } else if (char === charSpan.innerText) {
            charSpan.classList.remove("incorrect");
            charSpan.classList.add("correct");
        } else {
            charSpan.classList.add("incorrect");
            charSpan.classList.remove("correct");
        }
    });
});
