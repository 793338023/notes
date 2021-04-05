// 有效括号
function isV(str) {
  const map = {
    "(": ")",
    "[": "]",
    "{": "}",
  };

  let leftArr = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (!map[char]) {
      if (leftArr.length === 0) {
        return false;
      }

      const left = leftArr.pop();
      if (map[left] !== char) {
        return false;
      }
    } else {
      leftArr.push(char);
    }
  }

  return !leftArr.length;
}

// falt 扁平化

function falt(arr) {
  const handleArr = arr.reduce((pre, curr) => {
    return [...pre, ...(Array.isArray(curr) ? falt(curr) : [curr])];
  }, []);

  return handleArr;
}

console.log(
  falt([
    1,
    2,
    3,
    ["2", ["ll", "xxx", ["ooo", "xxx"], "mmm"], "ppp"],
    4,
    [4, 0, 1, 2, 30],
    5,
  ])
);
