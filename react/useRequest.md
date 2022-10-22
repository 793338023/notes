# 使用

在很多情况下请求都是请求数据，然后等待数据与处理数据返回的情况，当前后端有明确的对接规范时，大部分情况都是拿到数据后简单的处理或者直接展示在页面上，这个时候使用useRequest就很省略很多请求时的通用逻辑处理

```js
const {
    runAsync,
    data,
    loading,
  } = useRequest(async () => await new Promise((res) => {
    // eslint-disable-next-line @shein-bbl/bbl/translate-i18n-byT
    res({ msg: "成功", code: "0", info: { a: 1, b: 2 } })
  }));

  console.log(data);
// { msg: "成功", code: "0", info: { a: 1, b: 2 } }
```

支持的基础能力有：

- 自动请求/手动请求
- 轮询
- 防抖
- 节流
- 屏幕聚焦重新请求
- 错误重试
- loading delay
- SWR(stale-while-revalidate)
- 缓存

默认情况下，请求时组件初始化后就立马调用，而组件卸载时取消接受数据



# 请求的实现



# 插件的实现

