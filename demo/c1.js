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

function create() {
  const obj = {};

  const [con, ...args] = [...arguments];

  Object.create(obj, con);

  con.apply(obj)

}
