const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";

// Function to calculate the result based on the current expression
const calculate = (btnValue) => {
    if (btnValue === "=" && output !== "") {
        output = parseExpression(output);
    } else if (btnValue === "AC") {
        output = "";
    } else if (btnValue === "DEL") {
        output = output.toString().slice(0, -1);
    } else {
        if (output === "" && specialChars.includes(btnValue)) return;
        
        // Prevent adding more than one decimal point to a number
        if (btnValue === "." && output.includes(".")) {
            const lastNumber = output.split(/[*\/\+\-%]/).pop();
            if (lastNumber.includes(".")) return;
        }

        output += btnValue;
    }
    display.value = output;
};

// Function to parse and evaluate the expression
const parseExpression = (expression) => {
    const tokens = expression.split(/([*\/\+\-%])/).map(token => token.trim());
    let result = parseFloat(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextValue = parseFloat(tokens[i + 1]);

        if (operator === "+") result += nextValue;
        else if (operator === "-") result -= nextValue;
        else if (operator === "*") result *= nextValue;
        else if (operator === "/") {
            if (nextValue === 0) return "Error: Division by 0";
            result /= nextValue;
        }
        else if (operator === "%") result %= nextValue;
    }
    return Math.round(result * 10000) / 10000; // Rounding the result to avoid overflow
};

// Event listener for button clicks
buttons.forEach(button => {
    button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});

// Event listener for keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key >= 0 && e.key <= 9) {
        calculate(e.key);
    } else if (specialChars.includes(e.key)) {
        calculate(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
        calculate("=");
    } else if (e.key === "Backspace") {
        calculate("DEL");
    } else if (e.key === "Escape") {
        calculate("AC");
    } else if (e.key === ".") {
        calculate(".");
    }
});
