const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  resCallbackList = [];
  rejCallbackList = [];
  status = PENDING;
  value;
  reason;
  constructor(exfn) {
    exfn && exfn(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(val) {
    this.value = val;
    this.status = FULFILLED;

    while (this.resCallbackList.length) {
      const fn = this.resCallbackList.shift();
      fn();
    }
  }

  reject(reason) {
    this.reason = reason;
    this.status = REJECTED;

    while (this.rejCallbackList.length) {
      const fn = this.rejCallbackList.shift();
      fn();
    }
  }

  then(resFn, rejFn) {
    const p2 = new MPromise((res, rej) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          const x = resFn(this.value);
          resolvePromise(p2, x, res, rej);
        }, 1);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          const x = rejFn(this.reason);
          resolvePromise(p2, x, res, rej);
        }, 1);
      } else {
        this.resCallbackList.push(() => {
          const x = resFn(this.value);
          resolvePromise(p2, x, res, rej);
        });
        this.rejCallbackList.push(() => {
          const x = rejFn(this.reason);
          resolvePromise(p2, x, res, rej);
        });
      }
    });

    return p2;
  }
}

function resolvePromise(p2, x, res, rej) {
  if (p2 === x) {
    rej(new TypeError("Chaining cycle"));
  }

  if (x && (typeof x === "object" || typeof x === "function")) {
    const then = x.then;
    if (typeof then === "function") {
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

const p1 = new MPromise((res) => {
  setTimeout(() => {
    res("1111");
  }, 1000);
});

p1.then((val) => {
  console.log(val);
  return "2222";
})
  .then((val) => {
    console.log(val);
    return "3333";
  })
  .then((val) => {
    console.log(val);
  });
