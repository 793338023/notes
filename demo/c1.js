// Function.prototype.mCall = function (context, ...args) {
//   const argsThis = context || window;

//   argsThis.fn = this;
//   const ret = argsThis.fn(...args);
//   delete argsThis.fn;

//   return ret;
// };

// const a = {
//   c: 1,
// };

// function abc(a, b, c) {
//   console.log(this.c);
// }

// abc.mCall(a);

// Function.prototype.mBind = function () {
//   if (typeof this === "function") {
//     throw Error("不是函数");
//   }
//   const _this = this;
//   const context = [...arguments].slice(0, 1);
//   const args = [...arguments].slice(1);
//   return function F() {
//     if (this instanceof F) {
//      return new _this(...args, ...arguments);
//     } else {
//      return _this.apply(context, [...args, ...arguments]);
//     }
//   };
// };

// function abc() {}

// const a = { c: 1 };

// const V = abc.mBind(a);

// V();

// function create() {
//   const obj = {};

//   const [con, ...args] = [...arguments];

//   Object.create(obj, con);

//   con.apply(obj)

// }

// 归并排序
const arr = [-1, 9, 10, 7, 6, 1, 2];

mergeSort(arr, 0, arr.length - 1, new Array());
console.log(arr);

function merge(arr, left, mid, right, temp) {
  let i = left,
    j = mid + 1,
    n = mid,
    m = right,
    k = 0;

  while (i <= n && j <= m) {
    if (arr[i] < arr[j]) {
      temp[k++] = arr[i++];
    } else {
      temp[k++] = arr[j++];
    }
  }

  while (i <= n) {
    temp[k++] = arr[i++];
  }

  while (j <= m) {
    temp[k++] = arr[j++];
  }

  for (let l = 0; l < k; l++) {
    arr[l + left] = temp[l];
  }
}

function mergeSort(arr, left, right, temp) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid, temp);
    mergeSort(arr, mid + 1, right, temp);
    merge(arr, left, mid, right, temp);
  }
}
