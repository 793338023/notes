React 的新的 Context api 本质上并不是 React 或者 Mbox 这种状态管理工具的替代品，充其量只是对 React
自身状态管理短板的补充。而 Redux 和 Mbox 这两个库本身并不是为 React 设计的，对于一些小型的 React 应用
比较重。

https://blog.csdn.net/u012713450/article/details/100186169

https://github.com/jamiebuilds/unstated-next/blob/master/src/unstated-next.tsx

利用了 hook+context

首先 Provider 的 value 就是自定义 hook 的返回值，然后传入到 createContext 的 Provider 的 value 值里

所以后拿出来是都是 hook 的返回值

在 useContainer 里拿出了 context 的 value 值返回回去，而这里的 value 值就是 hook 的值

它是轻量级跨组件状态管理工具

只能保存一个 hook 在 context 上传递，没有时间旅行能力

而且 context 的自顶而下的状态传递已经改为哪个组件需要当前 context 就对其状态传递，无需考虑不涉及跨组件更新，它已经会更新当前使用的组件
