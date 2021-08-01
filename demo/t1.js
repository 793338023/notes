// 冒泡排序
// 从一个个排出最大
function sort1(arr) {
  if (!Array.isArray(arr)) {
    return;
  }
  const newArr = [...arr];
  let n = newArr.length - 1;
  while (n >= 0) {
    for (let i = 1; i <= n; i++) {
      if (newArr[i] < newArr[i - 1]) {
        [newArr[i - 1], newArr[i]] = [newArr[i], newArr[i - 1]];
      }
    }
    n--;
  }
  return newArr;
}

// console.log(sort1([10, 0, 1, 3, 5, 8, 1]));

// 快排
// function sort2(arr) {
//   if (arr.length <= 1) {
//     return arr;
//   }
//   const index = Math.floor(arr.length / 2);
//   const center = arr[index];
//   const left = [],
//     right = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (i !== index) {
//       if (center < arr[i]) {
//         right.push(arr[i]);
//       } else {
//         left.push(arr[i]);
//       }
//     }
//   }

//   return [...sort2(left), center, ...sort2(right)];
// }

// console.log(sort2([10, 0, 1, 3, 5, 8, 1]));

// function getTrans(root) {
//   const arr = [];

//   if (!root) {
//     return arr;
//   }
//   const levelArr = [root];
//   let size = levelArr.length;
//   let level = 0;
//   while (levelArr.length) {
//     const node = levelArr.shift();
//     if (!arr[level]) {
//       arr[level] = [];
//     }
//     arr[level].push(node.val);

//     if (node.left) {
//       levelArr.push(node.left);
//     }
//     if (node.right) {
//       levelArr.push(node.right);
//     }
//     size--;
//     if (size === 0) {
//       level++;
//       size = levelArr.length;
//     }
//   }

//   return arr;
// }
