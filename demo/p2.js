let a = 0;
let b = async () => {
  a = (await 10) + a;
  console.log("2", a); // -> '2' 10
};
b();
a++;
console.log("1", a); // -> '1' 1
