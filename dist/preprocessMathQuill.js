function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, find, replaceWith) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replaceWith);
}
function findClosingBrace(str, startIdx) {
  const braces = {
    "[": "]",
    "<": ">",
    "(": ")",
    "{": "}"
  };
  const openingBrace = str[startIdx];
  const closingBrace = braces[openingBrace];
  if (closingBrace === void 0) {
    throw Error(`${str} does not contain an opening brace at position ${startIdx}.`);
  }
  let stack = 1;
  for (let j = startIdx + 1; j < str.length; j++) {
    if (str[j] === openingBrace) {
      stack += 1;
    } else if (str[j] === closingBrace) {
      stack += -1;
    }
    if (stack === 0) {
      return j;
    }
  }
  throw Error(`${str} has a brace that opens at position ${startIdx} but does not close.`);
}
export function mathquillToMathJS(fromMQ) {
  const replacements = [
    {tex: "\\operatorname{diff}", mathjs: "diff"},
    {tex: "\\operatorname{pdiff}", mathjs: "pdiff"},
    {tex: "\\operatorname{curl}", mathjs: "curl"},
    {tex: "\\operatorname{div}", mathjs: "div"},
    {tex: "\\operatorname{norm}", mathjs: "norm"},
    {tex: "\\operatorname{mod}", mathjs: "mod"},
    {tex: "\\operatorname{abs}", mathjs: "abs"},
    {tex: "\\operatorname{unitT}", mathjs: "unitT"},
    {tex: "\\operatorname{unitN}", mathjs: "unitN"},
    {tex: "\\operatorname{unitB}", mathjs: "unitB"},
    {tex: "\\operatorname{arccosh}", mathjs: "arccosh"},
    {tex: "\\operatorname{arcsinh}", mathjs: "arcsinh"},
    {tex: "\\operatorname{arctanh}", mathjs: "arctanh"},
    {tex: "\\cdot", mathjs: " * "},
    {tex: "\\left", mathjs: ""},
    {tex: "\\right", mathjs: ""},
    {tex: "{", mathjs: "("},
    {tex: "}", mathjs: ")"},
    {tex: "~", mathjs: " "},
    {tex: "\\", mathjs: " "}
  ];
  const noFrac = fracToDivision(fromMQ);
  const noBraceSub = convertSubscript(noFrac);
  return replacements.reduce((acc, r) => replaceAll(acc, r["tex"], r["mathjs"]), noBraceSub);
}
function convertSubscript(expr) {
  const sub = "_{";
  const subStart = expr.indexOf(sub);
  if (subStart < 0) {
    return expr;
  }
  const numStart = subStart + sub.length;
  const closingBrace = expr.indexOf("}", numStart);
  const newExpr = expr.slice(0, subStart) + "_" + expr.slice(numStart, closingBrace) + expr.slice(closingBrace + 1);
  return convertSubscript(newExpr);
}
function fracToDivision(expr) {
  const frac = "\\frac";
  const fracStart = expr.indexOf(frac);
  const numStart = fracStart + frac.length;
  if (fracStart < 0) {
    return expr;
  }
  const divIdx = findClosingBrace(expr, numStart);
  const newExpr = expr.slice(0, fracStart) + expr.slice(numStart, divIdx + 1) + "/" + expr.slice(divIdx + 1);
  return fracToDivision(newExpr);
}
