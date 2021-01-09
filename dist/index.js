import {mathquillToMathJS} from "./preprocessMathQuill.js";
import {compile} from "../web_modules/mathjs.js";
import "../web_modules/toastify-js/src/toastify.css.proxy.js";
const equationSpan = document.getElementById("equation");
let compiled;
let compiledSrc;
const MQ = MathQuill.getInterface(2);
const field = MQ.MathField(equationSpan);
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");
let startTime = Date.now();
startBtn.onclick = () => {
  document.getElementById("time").innerText = "0";
  const equation = mathquillToMathJS(field.latex());
  try {
    startTime = Date.now();
    runEquation(equation);
  } catch (error) {
    console.error(error);
  }
};
setInterval(() => {
  if (!mathquillToMathJS(field.latex()).includes("t"))
    return;
  try {
    runEquation(mathquillToMathJS(field.latex()));
    document.getElementById("time").innerText = ((Date.now() - startTime) / 1e3).toFixed(1);
  } catch (error) {
  }
}, 10);
runEquation(mathquillToMathJS(field.latex()));
function mod(n, m) {
  return (n % m + m) % m;
}
function runEquation(equation) {
  if (compiledSrc !== equation) {
    console.log("recompiling equation");
    compiled = compile(equation);
    compiledSrc = equation;
  }
  const answers = [];
  for (let i = 0; i < canvas.height; i++) {
    answers.push(compiled.evaluate({
      x: i,
      t: ((Date.now() - startTime) / 1e3 * canvas.height).toFixed(1)
    }));
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx?.beginPath();
  ctx?.moveTo(0, canvas.width - mod(answers[0], canvas.width));
  answers.forEach((ans, x) => {
    const y = canvas.width - mod(ans, canvas.width);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  });
}
function runEquationNoTime(equation) {
  startTime = Date.now();
  if (compiledSrc !== equation) {
    console.log("recompiling equation");
    compiled = compile(equation);
    compiledSrc = equation;
  }
  const answers = [];
  for (let i = 0; i < canvas.height; i++) {
    answers.push(compiled.evaluate({
      x: i,
      t: 0
    }));
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx?.beginPath();
  ctx?.moveTo(0, canvas.width - mod(answers[0], canvas.width));
  answers.forEach((ans, x) => {
    const y = canvas.width - mod(ans, canvas.width);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  });
}
