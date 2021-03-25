const calculatorElement = document.querySelector('#calculator');

const calculator = {
  display: calculatorElement.querySelector('#display'),
  decimalBtn: calculatorElement.querySelector('#decimal-btn'),
  equalsBtn: calculatorElement.querySelector('#equals-btn'),
  clearBtn: calculatorElement.querySelector('#clear-btn'),
  deleteBtn: calculatorElement.querySelector('#delete-btn'),
  numbers: calculatorElement.querySelectorAll('.number'),
  operators: calculatorElement.querySelectorAll('.operator'),
}

calculator.numbers.forEach(number => number.addEventListener('click', (e) => {
  handleNumber(e);
}));
calculator.decimalBtn.addEventListener('click', handleDecimal);
calculator.operators.forEach(number => number.addEventListener('click', (e) => {
  handleOperator(e);
}));
calculator.equalsBtn.addEventListener('click', handleEquals);
calculator.deleteBtn.addEventListener('click', deleteLastInput);
calculator.clearBtn.addEventListener('click', setDefaults);

function handleNumber(e) {
  if (calculator.display.classList.contains('infinity')) return;

  const currentNumber = e.currentTarget.dataset.value;

  // Blocks possibility of chaining 0s if the only number is 0
  if (displayValue === '0' && currentNumber === '0') return;

  if (!isCalculating) {
    leftOperand += currentNumber;
    if (leftOperand.includes('.') && leftOperand.split('.')[1].length > 1 || leftOperand.length > 8) {
      leftOperand = leftOperand.substring(0, leftOperand.length - 1);
    }
    updateDisplay(leftOperand);
    lastInputType = 'number';
    return;
  }

  rightOperand += currentNumber;
  if (rightOperand.includes('.') && rightOperand.split('.')[1].length > 1) {
    rightOperand = rightOperand.substring(0, rightOperand.length - 1 || leftOperand.length > 8);
  }
  updateDisplay(rightOperand);
  lastInputType = 'number';
}

function handleDecimal() {
  if (isCalculating && !rightOperand) {
    rightOperand = '0.';
    updateDisplay(rightOperand);
    return;
  }
  
  if (displayValue.includes('.')) return;

  if (!leftOperand) {
    leftOperand = '0.';
    updateDisplay(leftOperand);
    return;
  }

  if (!isCalculating) {
    leftOperand += '.';
    updateDisplay(leftOperand);
    return;
  }

  rightOperand += '.'
  updateDisplay(rightOperand);
}

function handleOperator(e) {
  if (!leftOperand) return;
  if (lastInputType === 'operator') return;
  if (calculator.display.classList.contains('infinity')) return;

  const currentOperator = e.currentTarget.dataset.symbol;

  if (!lastOperator) {
    lastOperator = currentOperator;
    isCalculating = true;
    lastInputType = 'operator';
    return;
  }

  const result = operate(lastOperator, +leftOperand, +rightOperand);
  updateDisplay(result);

  lastOperator = currentOperator;
  leftOperand = result;
  rightOperand = '';
  lastInputType = 'operator';
}

function handleEquals() {
  if (!rightOperand) return;

  const result = operate(lastOperator, +leftOperand, +rightOperand);
  updateDisplay(result);

  leftOperand = result;
  rightOperand = '';
  lastOperator = '';
  lastInputType = 'equals';
  isCalculating = false;
}

function deleteLastInput() {
  if (!leftOperand) return;

  if (!rightOperand) {
    leftOperand = leftOperand.substring(0, leftOperand.length - 1);
    updateDisplay(leftOperand);
    return;
  }

  rightOperand = rightOperand.substring(0, rightOperand.length - 1);
    updateDisplay(rightOperand);
}

function setDefaults() {
  displayValue = '0';
  leftOperand = '';
  rightOperand = '';
  lastOperator = '';
  lastInputType = '';
  isCalculating = false;

  calculator.display.textContent = displayValue;
  calculator.display.classList.remove('infinity');
}

function updateDisplay(value) {
  displayValue = value;
  calculator.display.textContent = displayValue;
}

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

function operate(operator, a, b) {
  let output;

  switch (operator) {
    case '+':
      output = add(a, b);
      break;
    case '-':
      output = subtract(a, b);
      break;
    case '*':
      output = multiply(a, b);
      break;
    case '/':
      if (a === 0 || b === 0) {
        calculator.display.classList.add('infinity');
        return '';
      }
      output = divide(a, b);
      break;
  }

  // Check if the output has a decimal place; if it does, limit the output to two floating numbers
  if (output % 1 !== 0) output = output.toFixed(2);

  return output.toString();
}

setDefaults();