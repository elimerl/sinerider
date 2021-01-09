import { mathquillToMathJS } from './preprocessMathQuill';
import { chain, compile, cos, EvalFunction } from 'mathjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
const equationSpan = document.getElementById('equation');
const equationStaticSpan = document.getElementById('equation-static');

const canvas = <HTMLCanvasElement>document.getElementById('chart');
const ctx = canvas.getContext('2d');
const cache = new Map();
//@ts-expect-error
const MQ = MathQuill.getInterface(2);
const field = MQ.MathField(equationSpan, {
  handlers: {
    edit: () => {
      stop();
    },
  },
});
if (localStorage.getItem('equation')) {
  field.latex(localStorage.getItem('equation'));
}
//@ts-expect-error
document.getElementById('start').onclick = toggle;
preview();
function preview() {
  let compiled: EvalFunction;
  try {
    compiled = compile(mathquillToMathJS(field.latex()));
  } catch (error) {
    return;
  }
  const err = render(compiled);
  if (err) {
    console.error(err);
  }
}
function render(compiled: EvalFunction, t = 0) {
  const vertices = [];
  //@ts-expect-error
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = -(canvas.width / 2); x < canvas.width / 2; x++) {
    try {
      const y = mod(
        canvas.height -
          compiled.evaluate({
            x: x + canvas.width / 2,
            t,
            w: canvas.width,
            h: canvas.height,
          }),
        canvas.height,
      );
      //@ts-expect-error
      ctx.fillRect(x + canvas.width / 2, y, 1, y * canvas.height);
    } catch (error) {
      return error.message;
    }
  }
}
function start() {
  if (cache.has('interval')) {
    clearInterval(cache.get('interval'));
  }
  const compiled = compile(mathquillToMathJS(field.latex()));
  cache.set('compiled', compiled);
  cache.set('start', Date.now());
  cache.set(
    'interval',
    setInterval(() => {
      const t = (Date.now() - cache.get('start')) / 1000;
      render(compiled, t);
      //@ts-expect-error
      document.getElementById('time').innerText = t.toFixed(1);
    }, 10),
  );
}
function stop() {
  localStorage.setItem('equation', field.latex());
  clearInterval(cache.get('interval'));
  preview();
  //@ts-expect-error
  document.getElementById('time').innerText = '0';
}
function toggle() {
  //@ts-expect-error
  if (document.getElementById('time').innerText === '0') {
    start();
  } else {
    stop();
  }
}
document.body.onkeydown = (ev) => {
  if (ev.key === 'Enter') toggle();
};
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
