# react 源码浅析

![image-20230104191835623](/Users/10021534/Library/Application Support/typora-user-images/image-20230104191835623.png)



**实现双缓存技术, 在内存中构建 DOM 结构以及 DOM 更新, 在 commit 阶段实现 DOM 的快速更新.**

在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber树，正在内存中构建的Fiber树称为workInProgress Fiber树，它反映了要刷新到屏幕的未来状态。current Fiber树中的Fiber节点被称为current fiber。workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，它们通过alternate属性连接。

React应用的根节点通过current指针在不同Fiber树的rootFiber间切换来实现Fiber树的切换。当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新。由于有两颗fiber树，实现了异步中断时，更新状态的保存，中断回来以后可以拿到之前的状态。并且两者状态可以复用，节约了从头构建的时间。



https://segmentfault.com/q/1010000041065111

为什么不直接从 setState 节点开始更新，是因为 react 存放任务优先级的机制。每次 set 之后会生成一个新任务。react 会根据当前任务情况（未完成的任务，上次被打断的任务等）计算一个更新优先级，如果当然任务的优先级等于这个更新优先级，就不会新启动一个任务，而是复用之前的任务。也就是说一个任务中，存的更新可能不只是当前组件的 setState 引起的，还可能包括其他组件。因此不能直接从某个 setState 的组件开始更新，而是要从 root 开始遍历。



React更新的方式有三种:

（1）ReactDOM.render() || hydrate（ReactDOMServer渲染）
（2）setState()
（3）forceUpdate()



mount时

![image-20230125094749302](/Users/10021534/Library/Application Support/typora-user-images/image-20230125094749302.png)

![image-20230124083448655](/Users/10021534/Library/Application Support/typora-user-images/image-20230124083448655.png)



更新时

![image-20230129182211304](/Users/10021534/Library/Application Support/typora-user-images/image-20230129182211304.png)

![image-20230129182258964](/Users/10021534/Library/Application Support/typora-user-images/image-20230129182258964.png)



## scheduleUpdateOnFiber

调用markUpdateLaneFromFiberToRoot给父节点childLanes打上是否有子孙节点改变的标志

调用ensureRootIsScheduled

## ensureRootIsScheduled

`nextLanes` 获取最高 lane 等级新任务的 lanes 值，若最高优先级SyncLane为立即执行则走`scheduleCallback`=>`Scheduler_scheduleCallback`，进入`flushSyncCallbacks=>performSyncWorkOnRoot`，否则进入`performConcurrentWorkOnRoot`

`Scheduler_scheduleCallback`就是`unstable_scheduleCallback`

## unstable_scheduleCallback

1、计算过期时间

2、创建任务

3、`startTime（currentTime + delay） > currentTime`: 是延时任务。存入timeQunene。如果它是优先级`最高的延时任务`并且`无及时任务(taskQueue为空)`， 则通过`requestHostTimeout`将`timeQueue`中的task推入`taskQueue`中

4、如果是`即时任务`，则存入taskQueue。如果无主任务执行且`performWorkUntilDeadline` 也没有递归调用，则调用`requestHostCallback`进入正常的任务调度

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc0eb68ca6d244d4844f9b8918ac0068~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)



https://juejin.cn/post/6889314677528985614#heading-11

## performWorkUntilDeadline

从函数名上分析大概可以知道，这个函数会用来处理任务中的 callback，直到任务超过最大可执行时长

```
performWorkUntilDeadline=>
flushWork=>
workLoop=> 
取出taskQueue列表任务
```

workLoop 循环调度 taskQueue 队列或以 handleTimeout 递归调度 timerQueue 队列这两种方式，只有一个在激活状态，也即 requestHostCallback、requestHostTimeout 只有一个在调用周期中。因为，taskQueue 队列调度完毕，会调用 requestHostTimeout 处理 timerQueue 队列；timerQueue 队列有一个任务进入 taskQueue，又会调用 requestHostCallback 处理 taskQueue 队列。

```
requestHostTimeout=>
handleTimeout=>
requestHostCallback=>
schedulePerformWorkUntilDeadline=>
performWorkUntilDeadline=>
```

![img](https://upload-images.jianshu.io/upload_images/5387234-fbb8dca43114726c.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)



https://zhuanlan.zhihu.com/p/384525799



# render阶段

`render阶段`开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是同步更新还是异步更新。

```
performConcurrentWorkOnRoot =>
renderRootConcurrent =>
prepareFreshStack

// 重置调度队列,并从root节点开始调度,workInProgress回到root
prepareFreshStack(root, expirationTime);
```

markUpdateLaneFromFiberToRoot 根据lane 标记当前fiber是否有更新，若有更新上级节点fiber的childLanes标记为有更新，为了知道它的子孙节点有更新



workLoopSync和workLoopConcurrent两个方法的差异在于一个是同步，而另一个是异步(**concurrent**)的，而它遍历整棵fiber树的入口，进行深度优先遍历，构建出完整的workInProgress树。

react 加载或者更新时 workLoopSync或者workLoopConcurrent调用performUnitOfWork 进入 递和归的阶段 beginWork和completeUnitofWork 



```
function App() {
    return (
        <p>
            <span>array</span>
            <span>huang</span>
        </p>
    )
}

ReactDom.render(<App />, document.getElementById('#root'));
```

![image.png](https://segmentfault.com/img/bVcTPTp)



## beginWork

在beginWork阶段 当current为null时为首次加载，为mount，那么直接进行根据tag进行对应的逻辑，最后进入reconcileChildren，创建fiber节点



以下tag对应的标记，如函数组件、类组件、html 标签、树的根节点等，调用不同的函数，来得到下一个将要处理的 jsx 结构（即 element），然后再将得到的 element 结构解析成 fiber 节点。

![image-20230118160947558](/Users/10021534/Library/Application Support/typora-user-images/image-20230118160947558.png)



当current不为null时为更新，那么新和旧的props会比较，但由于jsx的props每次在render时拿到的props对象是一个新创建的对象，所以`oldProps !== newProps`都是不相等，而新和旧的props是上一次beginWork走了tag对应处理函数得到子节点，若当前组件开始render后得到的jsx若没有进行性能优化的子节点都会创建一个新的props对象导致子孙都会update一遍



当props和context没有变化并且无报错 会 attemptEarlyBailoutIfNoScheduledUpdate，即完全复用fiber的情况，会走这个函数，然后走bailoutOnAlreadyFinishedWork 检查childLanes状态决定子孙节点有更新，若有更新则复用当前fiber走cloneChildFibers，并返回子节点，若无更新直接返回null，完全复用当前的子孙节点，进行completeUnitOfWork

而didReceiveUpdate是在此过程标记是否有更新的，若为true有更新，则不会走bailoutOnAlreadyFinishedWork进行fiber节点的复用



在进入对应的tag进行函数处理时基本都进入reconcileChildren，进行diff算法，然后得出 effect list



## completeUnitOfWork

这是一个大循环，为了就是处理出effectList和向上遍历到根fiber节点，若`siblingFiber`存在，则会进行`beginWork`阶段，若没有则会把向上遍历节点

而`Incomplete`是为了判断是否有报错，若有则会执行`unwindWork`，后续的操作跟没有错误的情况差不多，但是多了一步，就是会向他的父节点增加`Incomplete`的`side effect tag`



## completeWork

在completeWork内也是根据tag走对应的处理逻辑，如HostComponent

在HostComponent的tag分为`mount阶段`这个阶段会创建dom和子级的dom，然后插入子级Dom，而`update节点`调用updateHostComponent内调用diffProperties得到原生标签上的属性的updatePayload更新数组，格式是：`[key,value]`的形式，奇数为key，偶数为value



在标记更新上使用markUpdate标记为当前fiber为更新和bubbleProperties标记子节点有更新



`bubbleProperties` 根据`fiber.child`及`fiber.child.sibling`更新`subtreeFlags`和`childLanes`, 主要是为了标记子树有没有更新, 这样可以通过 `fiber.subtreeFlags` 快速判断子树是否有副作用钩子，不需要深度遍历. 在`React17版本后`使用`subtreeFlags`替换了`finishWork.firstEffect`的副作用链表



![React-render归阶段完整流程.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a4463c2d2e04d7386e34de1b3cd4302~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

# commit阶段

当render阶段结束后就会进入commit阶段，那么在`performSyncWorkOnRoot`会直接调用`commitRoot`，而`performConcurrentWorkOnRoot`进入`finishConcurrentRender`处理异步的情况调用`commitRoot`



在以下的函数的调用都是从root开始的深度优先遍历

![image-20230125100231059](/Users/10021534/Library/Application Support/typora-user-images/image-20230125100231059.png)

## commitBeforeMutationEffects

```
commitBeforeMutationEffects =>
commitBeforeMutationEffects_begin =>
commitBeforeMutationEffects_complete=>
commitBeforeMutationEffectsOnFiber
```

根据subtreeFlags自顶向下寻找有副作用的节点，然后触发getSnapshotBeforeUpdate，这个调用class组件的



## commitMutationEffects

```
commitMutationEffects =>
commitMutationEffectsOnFiber =>
recursivelyTraverseMutationEffects =>
commitReconciliationEffects 
```

`commitMutationEffectsOnFiber`会根据tag判断选择对应的逻辑，但都会走`recursivelyTraverseMutationEffects`和`recursivelyTraverseMutationEffects`，而其他都先判断`flags & Update`是否有更新然后走对应的逻辑，如`FunctionComponent`就会执行hook的销毁函数列表`commitHookEffectListUnmount`，然后执行hook的执行函数列表`commitHookEffectListMount`

而原生组件`HostComponent`则是根据`updatePayload`更新html标签上的属性



recursivelyTraverseMutationEffects先进行删除操作，如dom节点、componentWillUnmount、hook的销毁函数

然后深度优先遍历调用commitMutationEffectsOnFiber

![image-20230125095319241](/Users/10021534/Library/Application Support/typora-user-images/image-20230125095319241.png)

commitReconciliationEffects根据flags判断是否节点移动，来进行dom节点插入或者移动



commitMutationEffects阶段执行完后会把构建的workInProgress树赋值给current树`root.current = finishedWork`

## commitLayoutEffects

```
commitLayoutEffects =>
commitLayoutEffects_begin =>
commitLayoutMountEffects_complete =>
commitLayoutEffectOnFiber =>

```

commitLayoutEffects_begin会从根节点开始向下遍历子节点，找到有副作用的节点，然后进入commitLayoutMountEffects_complete



commitLayoutMountEffects_complete进入commitLayoutEffectOnFiber根据不同tag不同的副作用操作，如FunctionComponent函数组件执行`useLayoutEffect`的effect环形链表，而ClassComponent class组件执行componentDidMount或componentDidUpdate生命周期函数

然后向上遍历，若有兄弟节点则return，然后继续commitLayoutEffects_begin，否则直到root才返回继续执行commitLayoutEffects_begin



所以commitLayoutEffects_begin是不断向下到有副作用节点，而commitLayoutMountEffects_complete则是找到兄弟节点或者回到root

### flushPassiveEffects

```
flushPassiveEffects =>
flushPassiveEffectsImpl=>
// 执行useEffect的销毁函数
commitPassiveUnmountEffects(root.current);
// 执行useEffect的create函数
commitPassiveMountEffects(root, root.current);
```

flushPassiveEffects的职责就是执行useEffect在上次更新的产生的销毁函数以及本次更新的回调函数。因此我们可以明确**commit阶段开始之前会先清理掉之前遗留的effect，由于effect中又可能触发新的更新而产生新的effect，因此要循环判断rootWithPendingPassiveEffects直到为null。**



useEffect中指定的回调是会在dom渲染后异步执行的，这就有别于useLayoutEffect，我们不妨来梳理下二者的回调和销毁的执行时机。

useLayoutEffect的销毁函数在mutation阶段执行

useLayoutEffect的回调在layout阶段执行

useEffect的销毁和回调都是在commit阶段后异步执行，先执行上次更新产生的销毁，再执行本次更新的回调。



我们发现相比useEffect，**useLayoutEffect无论销毁函数和回调函数的执行时机都要更早一些，且会在commit阶段中同步执行。因此我们说useLayoutEffects中适合dom操作，因为其回调中进行dom操作时，由于此时页面未完成渲染，因此不会有中间状态的产生，可以有效的避免闪动问题。但同时useLayoutEffects的执行会阻塞渲染，因此需谨慎使用。**





