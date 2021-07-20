const PENDING = "1";
const FINISH = "2";
const REJECT = "3";

class MyPromise {
  status = PENDING;
  resCBList = [];
  rejCBList = [];
  value;
  reason;

  constructor(exfn) {
    exfn && exfn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(val) {
    if (this.status === PENDING) {
      this.value = val;
      this.status = FINISH;
      while (this.resCBList.length) {
        const fn = this.resCBList.shift();
        fn();
      }
    }
  }

  reject(val) {
    if (this.status === PENDING) {
      this.reason = val;
      this.status = REJECT;
      while (this.rejCBList.length) {
        const fn = this.rejCBList.shift();
        fn();
      }
    }
  }

  then(resFn, rejFn) {
    const p2 = new MyPromise((res, rej) => {
      if (typeof rejFn !== "function") {
        rejFn = () => {};
      }
      if (typeof resFn !== "function") {
        resFn = () => {};
      }

      if (this.status === PENDING) {
        this.resCBList.push(() => {
          const ret = resFn(this.value);
          resolvePromise(p2, ret, res, rej);
        });
        this.rejCBList.push(() => {
          const ret = rejFn(this.reason);
          resolvePromise(p2, ret, res, rej);
        });
      }
      if (this.status === FINISH) {
        setTimeout(() => {
          const ret = resFn(this.value);
          resolvePromise(p2, ret, res, rej);
        }, 0);
      }
      if (this.status === REJECT) {
        setTimeout(() => {
          const ret = rejFn(this.reason);
          resolvePromise(p2, ret, res, rej);
        }, 0);
      }
    });

    return p2;
  }
}

function resolvePromise(p2, x, res, rej) {
  if (p2 === x) {
    return rej("循环引用");
  }

  if (x && (typeof x === "function" || typeof x === "object")) {
    const then = x.then;
    if (typeof x.then === "function") {
      then.call(
        x,
        (y) => {
          resolvePromise(p2, y, res, rej);
        },
        (r) => {
          rej(r);
        }
      );
    } else {
      res(x);
    }
  } else {
    res(x);
  }
}

new MyPromise((res, rej) => {
  setTimeout(() => {
    res("sss");
  }, 1000);
})
  .then((data) => {
    console.log(data);

    return data;
  })
  .then((data) => {
    console.log("xxx" + data);
  });
