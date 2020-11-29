## 不需要使用fastclick的情况

以下这几种情况是不需要使用fastclick：

1、FastClick是不会对PC浏览器添加监听事件
2、Android版Chrome 32+浏览器，如果设置viewport meta的值为width=device-width，这种情况下浏览器会马上出发点击事件，不会延迟300毫秒。

```js
<meta name="viewport" content="width=device-width, initial-scale=1">
```

3、所有版本的Android Chrome浏览器，如果设置viewport meta的值有user-scalable=no，浏览器也是会马上出发点击事件。
4、IE11+浏览器设置了css的属性touch-action: manipulation，它会在某些标签（a，button等）禁止双击事件，IE10的为-ms-touch-action: manipulation

5、IOS11 已经修复了300秒延迟。在11上应用fastclick反而会卡顿 input点击不了的

我的理解是，如果没有必要兼容低版本，可以不引入fastclick，因为fastclick的引入还是会出现很多点击上的问题，尤其是开发时的一些问题，比如模拟点击时出现两次的点击问题等等。

