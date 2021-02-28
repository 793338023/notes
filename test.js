function generateParenthesis(n) {
  const arr = [];
  generate(0, 0, "", n, arr);
  return arr;
}

function generate(left, right, contnent, n, arr) {
  if (left >= n && right >= n) {
    arr.push(contnent);
    return;
  } else {
    if (left < n) {
      generate(left + 1, right, contnent + "(", n, arr);
    }
    if (right < left) {
      generate(left, right + 1, contnent + ")", n, arr);
    }
  }
}

console.log(generateParenthesis(1));
