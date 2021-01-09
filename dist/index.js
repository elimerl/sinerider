import {mathquillToMathJS} from "./preprocessMathQuill.js";
import {compile} from "../web_modules/mathjs.js";
import "../web_modules/toastify-js/src/toastify.css.proxy.js";
const equationSpan = document.getElementById("equation");
console.log(equationSpan);
const MQ = MathQuill.getInterface(2);
const field = MQ.MathField(equationSpan);
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");
let startTime;
startBtn.onclick = () => {
  const equation = mathquillToMathJS(field.latex());
  try {
    startTime = Date.now();
    runEquation(equation);
  } catch (error) {
    console.error(error);
  }
};
setInterval(() => {
  try {
    runEquation(mathquillToMathJS(field.latex()));
  } catch (error) {
  }
}, 10);
function mod(n, m) {
  return (n % m + m) % m;
}
function runEquation(equation) {
  const compiled = compile(equation);
  const answers = [];
  for (let i = 0; i < canvas.height; i++) {
    answers.push(compiled.evaluate({x: i, t: Date.now() - startTime}));
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  answers.forEach((ans, i) => {
    ctx?.fillRect(i, canvas.width - mod(ans, canvas.width), 3, 3);
  });
}
