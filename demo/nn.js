const data = [
  {
    id: 2,
    name: "111",
    child: [
      { id: "3", name: "微信设备" },
      { id: "3", name: "sb设备" },
    ],
  },
  {
    id: 5,
    name: "222",
    child: [
      { id: "6", name: "1年" },
      { id: "6", name: "2年" },
      { id: "6", name: "3年" },
    ],
  },
  {
    id: 9,
    name: "333",
    child: [
      { id: "10", name: "广州" },
      { id: "11", name: "深圳" },
    ],
  },
];

function dealData(data) {
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    const child = data[i].child;
    if (Array.isArray(child)) {
      let size = arr.length;
      while ((i === 0 && arr.length === 0) || size--) {
        const curr = i === 0 ? "" : arr.shift();
        for (let j = 0; j < child.length; j++) {
          arr.push(curr + child[j].name);
        }
      }
    }
  }
  return arr;
}

console.log(dealData(data));
