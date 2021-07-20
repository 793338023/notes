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

// 普通的层次遍历

function levelOrder(root) {
  const ret = [];
  const queue = [];
  let level = 0;

  queue.push(root);

  while (queue.length) {
    ret.push([]);
    let size = queue.length;
    while (size--) {
      // 重点时这两行，获取到当前层的大小，然后只循环当前行
      const cur = queue.shift();

      ret[level].push(cur.value);

      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }

    level++;
  }

  return ret;
}

var numSquares = function (n) {
  let queue = [];
  queue.push([n, 0]);
  while (queue.length) {
    let [num, step] = queue.shift();
    for (let i = 1; ; i++) {
      let nextNum = num - i * i;
      if (nextNum < 0) break;
      // 还差最后一步就到了，直接返回 step + 1
      if (nextNum == 0) return step + 1;
      queue.push([nextNum, step + 1]);
    }
  }
  // 最后是不需要返回另外的值的，因为 1 也是完全平方数，所有的数都能用 1 来组合
};

var topKFrequent = function (nums, k) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const item = map.get(nums[i]) || 0;
    map.set(nums[i], item + 1);
  }

  const arr = [];
  for (const [key, value] of map) {
    arr.push({ key, value });
  }

  arr.sort((a, b) => b.value - a.value);

  return arr.slice(0, k).map((item) => item.key);
};
console.log(topKFrequent([1, 1, 2, 2, 5, 5, 1, 5], 2));

function foo(...args) {
  // 要求实现代码
}

// 都输出6
foo(1, 2, 3).getValue();

foo(1, 2)(3).getValue();

foo(1)(2)(3).getValue();
