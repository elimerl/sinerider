import { mathquillToMathJS } from './preprocessMathQuill';
import { compile } from 'mathjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
const equationSpan = document.getElementById('equation');
console.log(equationSpan);
//@ts-expect-error
const MQ = MathQuill.getInterface(2);
const field = MQ.MathField(equationSpan);
const canvas = <HTMLCanvasElement>document.getElementById('chart');
const ctx = canvas.getContext('2d');
const startBtn = <HTMLButtonElement>document.getElementById('start');
let startTime: number;
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
  } catch (error) {}
}, 10);
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
function runEquation(equation: string) {
  const compiled = compile(equation);
  const answers = [];
  for (let i = 0; i < canvas.height; i++) {
    answers.push(compiled.evaluate({ x: i, t: Date.now() - startTime }));
  }
  //@ts-expect-error
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //@ts-expect-error
  ctx.fillStyle = 'black';
  answers.forEach((ans, i) => {
    ctx?.fillRect(i, canvas.width - mod(ans, canvas.width), 3, 3);
  });
}
