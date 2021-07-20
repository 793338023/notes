```js
// 导入依赖
const path = require("path"); // 路径操作
const fs = require("fs"); // 文件读取
const vm = require("vm"); // 文件执行

// 定义导入类，参数为模块路径
function Require(modulePath) {
  // 获取当前要加载的绝对路径
  let absPathname = path.resolve(__dirname, modulePath);
  // 创建模块，新建Module实例
  const module = new Module(absPathname);
  // 加载当前模块
  tryModuleLoad(module);
  // 返回exports对象
  return module.exports;
}
// 定义模块, 添加文件id标识和exports属性
function Module(id) {
  this.id = id;
  // 读取到的文件内容会放在exports中
  this.exports = {};
}
// 定义包裹模块内容的函数
Module.wrapper = [
  "(function(exports, module, Require, __dirname, __filename) {",
  "})",
];
// 定义扩展名，不同的扩展名，加载方式不同，实现js和json
Module._extensions = {
  ".js"(module) {
    const content = fs.readFileSync(module.id, "utf8");
    const fnStr = Module.wrapper[0] + content + Module.wrapper[1];
    const fn = vm.runInThisContext(fnStr);
    fn.call(
      module.exports,
      module.exports,
      module,
      Require,
      _filename,
      _dirname
    );
  },
  ".json"(module) {
    const json = fs.readFileSync(module.id, "utf8");
    module.exports = JSON.parse(json); // 把文件的结果放在exports属性上
  },
};
// 定义模块加载方法
function tryModuleLoad(module) {
  // 获取扩展名
  const extension = path.extname(module.id);
  // 通过后缀加载当前模块
  Module._extensions[extension](module);
}
```

分析实现步骤 1.导入相关模块，创建一个 Require 方法。

2.抽离通过 Module.\_load 方法，用于加载模块。

3.Module.resolveFilename 根据相对路径，转换成绝对路径。

4.缓存模块 Module.\_cache，同一个模块不要重复加载，提升性能。

5.创建模块 id: 保存的内容是 exports = {}相当于 this。

6.利用 tryModuleLoad(module, filename) 尝试加载模块。

7.Module.\_extensions 使用读取文件。

8.Module.wrap: 把读取到的 js 包裹一个函数。

9.将拿到的字符串使用 runInThisContext 运行字符串。

10.让字符串执行并将 this 改编成 exports。


https://mp.weixin.qq.com/s/Rwx6OezeZUSb3YOUEnutFQ