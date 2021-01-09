import { mathquillToMathJS } from './preprocessMathQuill';
import { compile, EvalFunction } from 'mathjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
const equationSpan = document.getElementById('equation');
let compiled: EvalFunction;
let compiledSrc: string;
//@ts-expect-error
const MQ = MathQuill.getInterface(2);
const field = MQ.MathField(equationSpan);
const canvas = <HTMLCanvasElement>document.getElementById('chart');
const ctx = canvas.getContext('2d');
const startBtn = <HTMLButtonElement>document.getElementById('start');
let startTime = Date.now();
startBtn.onclick = () => {
  //@ts-expect-error
  document.getElementById('time').innerText = '0';
  const equation = mathquillToMathJS(field.latex());
  try {
    startTime = Date.now();
    runEquation(equation);
  } catch (error) {
    console.error(error);
  }
};
setInterval(() => {
  if (!mathquillToMathJS(field.latex()).includes('t')) return;
  try {
    runEquation(mathquillToMathJS(field.latex()));
    //@ts-expect-error
    document.getElementById('time').innerText = (
      (Date.now() - startTime) /
      1000
    ).toFixed(1);
  } catch (error) {}
}, 10);
runEquation(mathquillToMathJS(field.latex()));

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
function runEquation(equation: string) {
  if (compiledSrc !== equation) {
    console.log('recompiling equation');
    compiled = compile(equation);
    compiledSrc = equation;
  }
  const answers = [];
  for (let i = 0; i < canvas.height; i++) {
    answers.push(
      compiled.evaluate({
        x: i,
        t: (((Date.now() - startTime) / 1000) * canvas.height).toFixed(1),
      }),
    );
  }
  //@ts-expect-error
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //@ts-expect-error
  ctx.strokeStyle = 'black';
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
