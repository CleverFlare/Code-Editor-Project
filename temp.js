const textArea = document.querySelector("[data-text-area]");
const caret = document.querySelector("[data-caret]");
const lines = [""];
let row = 0;
let column = 0;
let letterWidth, letterHeight;
let caretVarticlePosition = 0;

const dummyLetter = document.createElement("div");
dummyLetter.style.position = "absolute";
dummyLetter.style.top = "0";
dummyLetter.style.whiteSpace = "nowrap";
dummyLetter.style.font = "1rem monospace";
dummyLetter.innerHTML = "l";
document.body.appendChild(dummyLetter);
letterWidth = dummyLetter.offsetWidth - 0.3;
letterHeight = dummyLetter.offsetHeight;
console.log(letterWidth);
console.log(letterHeight);
console.log(caret);

function textAreaMutation() {
  textArea.innerHTML = "";
  lines.forEach((line, index) => {
    const codeLine = document.createElement("div");
    codeLine.classList.add("code-line");
    codeLine.innerText = line;
    textArea.appendChild(codeLine);
  });
}

const moveRow = (direction = null) => {
  switch (direction) {
    case "+":
      if (row >= lines[column].length) return;
      row++;
      caretVarticlePosition += letterWidth;
      caret.style.transform = `translate(${caretVarticlePosition}px, 0)`;
      break;
    case "-":
      if (row <= 1) return;
      row--;
      caretVarticlePosition -= letterWidth;
      caret.style.transform = `translate(${caretVarticlePosition}px, 0)`;
      break;
    default:
      row = lines[column].length - 1;
      caretVarticlePosition += letterWidth;
      caret.style.transform = `translate(${caretVarticlePosition}px, 0)`;
  }
};

const moveColumn = (direction = null) => {
  switch (direction) {
    case "+":
      column += 1;
      break;
    case "-":
      column -= 1;
      break;
    default:
      column = lines.length - 1;
  }
};

textAreaMutation();

console.log(getComputedStyle(caret).getPropertyValue("left"));

textArea.addEventListener("keydown", (event) => {
  const { keyCode, key } = event;
  if ((keyCode >= 48 && keyCode <= 90) || (keyCode >= 186 && keyCode <= 222)) {
    lines[column] =
      lines[column].substring(0, row) +
      key +
      lines[column].substring(row, lines[column].length);
    moveRow("+");
  } else if (key === "Enter") {
    lines.push("");
    column++;
  } else if (key === " ") {
    lines[column] =
      lines[column].substring(0, row) +
      " " +
      lines[column].substring(row, lines[column].length);
    moveRow("+");
  } else if (key === "Backspace") {
    lines[column] =
      lines[column].substring(0, row) +
      lines[column].substring(row + 1, lines[column].length);
    moveRow("-");
  } else if (key === "ArrowLeft") {
    moveRow("-");
  } else if (key === "ArrowRight") {
    moveRow("+");
  } else if (key === "ArrowUp") {
    moveColumn("-");
    console.log(column);
  } else if (key === "ArrowDown") {
    moveColumn("+");
    console.log(column);
  }
  console.log(row);
  textAreaMutation();
});
