## setState 同步还是异步

legacy 模式

状态更新进入了批量处理就是异步的，异步调用里就是同步的

concurrent 模式

unstable_createRoot 是异步，无论在异步里还是同步里

————————————————————————————————

js 单线程

优先级

渲染可中断
