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

```js
class Fetch<TData, TParams extends any[]> {
  pluginImpls: PluginReturn<TData, TParams>[];

  // 记录当前取消和调用的次数，达到取消的效果
  count = 0;

  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>> = {}
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    };
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe();
  }

  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }

  async runAsync(...params: TParams): Promise<TData> {
    this.count += 1;
    const currentCount = this.count;

    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler("onBefore", params);

    // stop request
    if (stopNow) {
      return new Promise(() => {});
    }

    this.setState({
      loading: true,
      params,
      ...state,
    });

    // return now
    if (returnNow) {
      return Promise.resolve(state.data);
    }

    this.options.onBefore?.(params);

    try {
      // replace service
      let { servicePromise } = this.runPluginHandler(
        "onRequest",
        this.serviceRef.current,
        params
      );

      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      const res = await servicePromise;

      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      if (res.code === SUCCESS_CODE) {
        this.options.onSuccess?.(res.info, params, res);
      }

      this.runPluginHandler("onSuccess", res, params);

      this.options.onFinally?.(res, params, undefined);

      if (currentCount === this.count) {
        this.runPluginHandler("onFinally", res, params, undefined);
      }

      return res;
    } catch (error) {
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      this.setState({
        error,
        loading: false,
      });

      this.options.onError?.(error, params);
      this.runPluginHandler("onError", error, params);

      this.options.onFinally?.(undefined, params, error);

      if (currentCount === this.count) {
        this.runPluginHandler("onFinally", undefined, params, error);
      }

      throw error;
    }
  }

  run(...params: TParams) {
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
        Message.error(t("系统错误，请稍后再试"));
      }
    });
  }

  cancel() {
    this.count += 1;
    this.setState({
      loading: false,
    });

    this.runPluginHandler("onCancel");
  }

  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || []));
  }

  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || []));
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    let targetData: TData | undefined;
    if (isFunction(data)) {
      targetData = data(this.state.data);
    } else {
      targetData = data;
    }

    this.runPluginHandler("onMutate", targetData);

    this.setState({
      data: targetData,
    });
  }
}
```







# 插件的实现

