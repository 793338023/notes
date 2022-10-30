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
// 插件列表
  pluginImpls: PluginReturn<TData, TParams>[];

  // 记录当前取消和调用的次数，达到取消的效果
  count = 0;

  state: FetchState<TData, TParams> = {
    loading: false, 
    params: undefined, //保存入参 
    data: undefined, // 返回数据
    error: undefined, // 报错数据
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
  
 // 数据更新
  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe();
  }
    
  // 触发插件钩子函数，event触发的时机如onBefore
  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }
    
  // 调用请求，返回当前请求结果
  async runAsync(...params: TParams): Promise<TData> {
    // 每次调用累加，作用保证使用最后一次请求的数据或者取消请求
    this.count += 1;
    const currentCount = this.count;

    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler("onBefore", params);

    // 停止请求，这是提供给插件在请求前使用的参数
    if (stopNow) {
      return new Promise(() => {});
    }

    this.setState({
      loading: true,
      params,
      ...state,
    });

    // 使用插件提供的数据，立马返回，不在请求，这也是请求前，在缓存时使用
    if (returnNow) {
      return Promise.resolve(state.data);
    }
    
    // 方式使用时请求前的处理，不会进行数据处理或者拦截
    this.options.onBefore?.(params);

    try {
      // 准备请求时对请求对象，插件对其进行处理，如替换请求对象
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
        // 当前请求不是最新请求时，放弃获取这次的数据
        return new Promise(() => {});
      }

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      this.options.onSuccess?.(res, params);
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
      }
    });
  }

  cancel() {
    // 取消获取请求数据
    this.count += 1;
    this.setState({
      loading: false,
    });

    this.runPluginHandler("onCancel");
  }

  refresh() {
    this.run(...(this.state.params || []));
  }

  refreshAsync() {
    // 使用之前的入参重新发起请求
    return this.runAsync(...(this.state.params || []));
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    // 修改请求返回结果，若想返回的data为处理的数据可在此处处理
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

请求的核心就是以上代码，而插件钩子的实现基本都在`runAsync`,如请求前`onBefore`请求时`onRequest`，请求成功`onSuccess`，请求完成`onFinally`，请求失败 `onError`，而请求的取消是没有去取消请求的，只是对请求的数据不再接受，而这它所需要支持的能力都是插件实现的，如自动请求，请求缓存，错误重试等等



在事例化之前还有一个初始化钩子`onInit`，主要是为了修改实例化入参，如自动请求就是修改它的loading状态



# 插件的实现

useRequest的第三个参数就是自定义插件

如自动请求

```js
const useAutoRunPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { manual, ready = true, defaultParams = [], refreshDeps = [], refreshDepsAction },
) => {
  const hasAutoRun = useRef(false);
  hasAutoRun.current = false;

  useUpdateEffect(() => {
    if (!manual && ready) {
      hasAutoRun.current = true;
      fetchInstance.run(...defaultParams);
    }
  }, [ready]);

  useUpdateEffect(() => {
    if (hasAutoRun.current) {
      return;
    }
    if (!manual) {
      hasAutoRun.current = true;
      if (refreshDepsAction) {
        refreshDepsAction();
      } else {
        fetchInstance.refresh();
      }
    }
  }, [...refreshDeps]);

  return {
    onBefore: () => {
      if (!ready) {
        return {
          stopNow: true,
        };
      }
    },
  };
};

useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  return {
    loading: !manual && ready,
  };
};
```

refreshDeps依赖项，状态更新重新触发请求

其他的插件可以查看[GitHub - alibaba/hooks: A high-quality &amp; reliable React Hooks library.](https://github.com/alibaba/hooks)


