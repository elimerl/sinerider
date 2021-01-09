import {mathquillToMathJS} from "./preprocessMathQuill.js";
import {compile} from "../web_modules/mathjs.js";
import Toastify from "../web_modules/toastify-js.js";
import "../web_modules/toastify-js/src/toastify.css.proxy.js";
const equationSpan = document.getElementById("equation");
let compiled;
let compiledSrc;
const MQ = MathQuill.getInterface(2);
const field = MQ.MathField(equationSpan);
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");
const urlBtn = document.getElementById("url");
if (window.location.hash) {
  field.latex(window.location.hash.slice(1));
}
urlBtn.onclick = () => {
  navigator.clipboard.writeText(getUrl());
  Toastify({text: "Copied link!", backgroundColor: "green"}).showToast();
};
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
  console.log(getUrl());
};
setInterval(() => {
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
  ctx.fillStyle = "green";
  answers.forEach((ans, x) => {
    const y = canvas.width - mod(ans, canvas.width);
    ctx?.fillRect(x, y, 1, canvas.height - y);
  });
}
function getUrl() {
  const url = new URL(window.location.href);
  url.hash = field.latex();
  return url.href;
}
