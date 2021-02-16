```js
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  // root节点，render方法接受的第二个参数
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  // 当前应用对应的fiber对象，是root fiber
  this.current = null;
  this.pingCache = null;
  // 在commit阶段只会处理这个值对应的任务
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoLanePriority;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;

  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  if (enableCache) {
    this.pooledCache = null;
    this.pooledCacheLanes = NoLanes;
  }

  if (supportsHydration) {
    this.mutableSourceEagerHydrationData = null;
  }

  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }
}
```

## fiber

虚拟 DOM 即 fiber

串联整个应用形成树结构

1. 从架构上，react15 是通过 reconciler 递归的方法执行，数据保存在递归调用栈，stack reconciler，react16 基于 fiber 节点实现，fiber reconciler

2. 作为静态的数据，每个 fiber 对应 react emenent，保存该组件的类型（函数组件/类组件/原生组件），对应的 DOM 节点信息

3. 作为动态单元，每个 fiber 节点保存了本次更新中改组件的变化的状态，执行的工作（需要被删除/被插入/被更新）

## update

用于记录组件状态的变化

存放于 updateQueue 中

react 整套代码很大一部分都是为了怎么样更新的

scheduler 调度
优先级，可中断

react 是 view 层，可以使用一个功能代表 UI 的展示 UI = fn(x)，而它主要是屏蔽了 DOM 的操作，使用`setState`或`useState`更新来刷新 UI，它是一个很纯粹的框架，因为他没有丰富的 API，它的核心 API 就是`setState`或`useState`，其他的 API 都是围绕的更好的组件化而出现的，而想改变 UI 在遵循 react 的标准就只能使用`setState`或`useState`改变状态

当然还有一个`useReducer`，但它和`useState`是差不多的，只是`useState`是`useReducer`更上层的实现

所以使用 react，在上手难易程度上更多是你 javascript 的基础能力好坏

setState 本身的方法调用是同步的，但调用了 setState 并不标志着它立马就更新，更新是要根据执行的上下文来判断的，处于批量更新的情况下，不是立马更新的，而不处于批量更新，那它就是有可能立马更新的，因为有异步渲染的模式，这个模式是批量更新的

---

是否更新组件，判断 props，state，context 是否有改变，是否 forceUpate

---
