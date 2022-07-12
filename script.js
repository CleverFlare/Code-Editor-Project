const codeArea = document.querySelector("[data-code-area]");
const lineNumbersList = document.querySelector("[data-line-numbering]");
const caret = document.querySelector("[data-caret]");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const lines = [""];
let row = 0;
let column = 0;
let caretHorizontalPosition = 0;
let caretVarticalPosition = 0;
let characterWidth;

ctx.font = "monospace";
console.log(ctx.measureText("m"));

const letterMatricsElement = document.createElement("p");
letterMatricsElement.style.position = "absolute";
letterMatricsElement.style.top = "0px";
letterMatricsElement.style.left = "0px";
letterMatricsElement.style.whiteSpace = "pre";
letterMatricsElement.style.opacity = "0";
letterMatricsElement.style.pointerEvents = "none";
letterMatricsElement.style.font = "1rem monospace";
letterMatricsElement.style.width = "max-content";
document.body.appendChild(letterMatricsElement);

const syncCaretPosition = () => {
  letterMatricsElement.innerHTML = lines[column].slice(0, row);
  characterWidth = parseFloat(getComputedStyle(letterMatricsElement).width);
  caretHorizontalPosition = characterWidth;
  caretVarticalPosition = 25 * column;
  caret.style.transform = `translate(${caretHorizontalPosition}px, ${caretVarticalPosition}px)`;
};

const caretHorizontalMovement = (type, steps = 1) => {
  switch (type) {
    case "+":
      if (row >= lines[column].length) return;
      if (steps > lines[column].length - row) {
        row = lines[column].length;
      } else {
        row += steps;
      }
      break;
    case "-":
      if (row <= 0) return;
      if (steps < 0) {
        row = 0;
      } else {
        row -= steps;
      }
      break;
    case "=>":
      row = lines[column].length;
      break;
    case "<=":
      row = 0;
      break;
    default:
      if (row >= lines[column].length) return;
      row += steps;
  }
  syncCaretPosition();
};

const caretVarticalMovement = (type, steps = 1) => {
  switch (type) {
    case "+":
      if (column >= lines.length - 1) return;
      if (steps > lines.length - 1 - column) {
        column = lines.length - 1;
      } else {
        column += steps;
      }
      break;
    case "-":
      if (column <= 0) return;
      if (steps < 0) {
        column = 0;
      } else {
        column -= steps;
      }
      break;
    default:
      if (column >= lines.length - 1) return;
      column += steps;
  }
  adjustCaretWhenOutOfRange();
  syncCaretPosition();
};

const adjustCaretWhenOutOfRange = () => {
  if (row <= lines[column].length) return;
  row = lines[column].length;
};

const createNewLine = (value, index) => {
  const lineElement = document.createElement("div");
  lineElement.setAttribute("data-code-line", "");
  lineElement.innerHTML = value;
  codeArea.appendChild(lineElement);
};

const createNewLineNumber = (number) => {
  const lineNumber = document.createElement("span");
  lineNumber.setAttribute("data-line-number", "");
  lineNumber.innerHTML = number;
  lineNumbersList.appendChild(lineNumber);
};

const originateLines = () => {
  codeArea.innerHTML = "";
  lines.forEach((line, index) => {
    createNewLine(line, index);
  });
};

const originateLineNumbers = () => {
  lineNumbersList.innerHTML = "";
  lines.forEach((line, index) => {
    createNewLineNumber(index + 1);
  });
};

const detectActiveLine = () => {
  const allLineNumbers = lineNumbersList.querySelectorAll("[data-line-number]");
  allLineNumbers.forEach((lineNumber, index) => {
    lineNumber.removeAttribute("data-active");
  });
  allLineNumbers[column].setAttribute("data-active", "");
};

const lineSwap = (type) => {
  const temp = lines[column];
  if (type === "up" && column > 0) {
    lines[column] = lines[column - 1];
    lines[column - 1] = temp;
    caretVarticalMovement("-");
  } else if (type === "down" && column < lines.length - 1) {
    lines[column] = lines[column + 1];
    lines[column + 1] = temp;
    caretVarticalMovement("+");
  }
};

codeArea.addEventListener("keydown", (event) => {
  const { keyCode, key, altKey } = event;
  event.preventDefault();
  if (
    (keyCode >= 48 && keyCode <= 90) ||
    (keyCode >= 186 && keyCode <= 222) ||
    (keyCode >= 96 && keyCode <= 111) ||
    key === " "
  ) {
    lines[column] =
      lines[column].substring(0, row) +
      key +
      lines[column].substring(row, lines[column].length);
    caretHorizontalMovement("+");
  } else if (key === "Enter") {
    const temp = lines[column].slice(row, lines[column].length);
    lines[column] = lines[column].slice(0, row);
    lines.splice(column + 1, 0, `${temp}`);
    caretVarticalMovement("+");
    caretHorizontalMovement("<=");
  } else if (keyCode >= 37 && keyCode <= 40) {
    if (!altKey) {
      switch (key) {
        case "ArrowLeft":
          if (row <= 0) {
            caretVarticalMovement("-");
            caretHorizontalMovement("=>");
          } else {
            caretHorizontalMovement("-");
          }
          break;
        case "ArrowRight":
          if (row >= lines[column].length) {
            caretVarticalMovement("+");
            caretHorizontalMovement("<=");
          } else {
            caretHorizontalMovement("+");
          }
          break;
        case "ArrowUp":
          caretVarticalMovement("-");
          break;
        case "ArrowDown":
          caretVarticalMovement("+");
          break;
      }
    } else {
      switch (key) {
        case "ArrowUp":
          lineSwap("up");
          break;
        case "ArrowDown":
          lineSwap("down");
          break;
      }
    }
  } else if (key === "Backspace") {
    if (lines[column] === "" && lines.length > 1) {
      lines.splice(column, 1);
      caretVarticalMovement("-");
      caretHorizontalMovement("=>");
    } else {
      lines[column] =
        lines[column].substring(0, row - 1) +
        lines[column].substring(row, lines[column].length);
      caretHorizontalMovement("-");
    }
  } else if (key === "Delete") {
    lines[column] =
      lines[column].substring(0, row) +
      lines[column].substring(row + 1, lines[column].length);
  } else if (key === "Tab") {
    // event.preventDefault();
    lines[column] =
      lines[column].substring(0, row) +
      "\t" +
      lines[column].substring(row, lines[column].length);
    caretHorizontalMovement("+");
  } else if (key === "Home" || key === "End") {
    switch (key) {
      case "Home":
        caretHorizontalMovement("<=");
        break;
      case "End":
        caretHorizontalMovement("=>");
        break;
    }
  }
  originateLines();
  originateLineNumbers();
  detectActiveLine();
});

originateLines();

codeArea.addEventListener("mousedown", (event) => {
  const { offsetY } = event;
  if (offsetY > caret.getBoundingClientRect().y) {
    const formula = Math.floor(
      (offsetY - caret.getBoundingClientRect().y) / 25
    );
    caretVarticalMovement("+", formula);
  } else {
    const formula = Math.ceil((caret.getBoundingClientRect().y - offsetY) / 25);
    caretVarticalMovement("-", formula);
  }
  originateLines();
  originateLineNumbers();
  detectActiveLine();
});
