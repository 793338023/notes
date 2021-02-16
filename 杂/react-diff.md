## 描述

由于性能瓶颈的问题，跨节点比较代价很大，而效益很低，我们日常开发上跨节点频率又比较低，权衡利弊下，只进行同级节点的比较，算法复杂度为 O(n)，若跨节点为 O(n3)

而 key 设计是为了更加高性能的复用节点，在不使用 key 值时 key 默认为 null，若出现移动节点，那么它们就会销毁节点重新创建，若有 key 值，那么就会优先复用之前的节点，减少销毁创建的开销

而 diff 算法在源码的入口是`reconcileChildFibers`，会根据 newChild 类型使用不同的处理函数，如单节点、多节点、文本节点等

比较有代表的是单节点与多节点处理方式

diff 算法比较 currentFirstFiber 与 newChild，返回 workInProgress

newChild 就是触发 render 后返回 jsx 的 DOM 节点信息，currentFirstFiber 就是之前产生的 fiber 信息

## 单节点

判断 newChild 为 Object 不为 null 时为单节点

然后根据$$typeof 选择对应的处理单节点方式，但它们的处理方式都是类似的，分别为`REACT_ELEMENT_TYPE`、 `REACT_PORTAL_TYPE`、`REACT_LAZY_TYPE`

以`reconcileSingleElement`为例

单节点更新 会遍历 child，当 key 不等时，会把当前 child 标记为删除，继续遍历，当 key 相等时，会判断 type 是否相同，不同，标记删除包括它之内的后续的兄弟节点，相同，标记删除它之后的兄弟节点

而只有 key 与 type 相同时才复用之前 fiber，否则都是创建新的 fiber

- 为啥要删除它的兄弟节点呢？

因为当前 newChild 以为单节点了，那么它之前有可能是多节点，所以需要删除除它之外的节点

## 多节点

`reconcileChildrenArray`

由于单向链表，无法使用双指针算法

newChildren 会进行两次的循环，第一次是为了遍历与 oldFiber 相同 key 的复用情况，当出现不相同的情况就跳出循环，进行下轮在这个下标基础上的循环

数组节点第一次循环的情况：
1、oldFiber 与 newChildren 长度一样，并且 key 都相同
2、oldFiber 比 newChildren 长，并且除了多出来的，并且 key 都相同
3、oldFiber 比 newChildren 短，并且除了多出来的，并且 key 都相同
4、newChildren 中有 oldFiber 匹配不中的 key，跳出循环，进行第二次循环

而多出来的节点，若是 oldFiber 直接把它们都标记为删除，若是 newChildren 直接插入到链表后面

而不可复用情况有两种：
1、不跳出第一次循环的 key 值相同而 type 不等，那么只会创建一个新的 fiber 节点，把旧的 fiber 节点标记为删除
2、key 值不等跳出第一次循环，进行下轮的循环

二次循环都是一次循环时未遍历完跳出导致的，所以 oldFiber 与 newChildren 都还有剩余，会根据第一次循环的下标进行第二次遍历
二次循环的情况：
1、把剩余的旧节点转换为 map，key 为 key 值，value 为 fiber 节点
2、获取比较后的节点，根据 alternate 判断是否是复用节点，如果是则删除 map 匹配中的 fiber
3、lastPlacedIndex 是移动节点的标志，如果节点不是复用节点，直接打上移动标志，并且 lastPlacedIndex 为当前下标位置，否则当前复用节点的位置小于 lastPlacedIndex，打上移动标志，当大于等于，把当前 fiber 的位置赋值给 lastPlacedIndex，所以 lastPlacedIndex 一直在向右移动，而打上移动标志的也是只会向右移动，那么减少向前移动节点会一定程度上提高性能，比如我们把一个 100 个节点数组的最后一个移动到第一位，那么 diff 算法就会把它前面的 99 个都打上移动标志，除了它自己本身，因为 lastPlacedIndex 就是它自己的位置

## 总结

在优先级为同级的情况下，diff 算法的核心就是 key 与 type 的比较，而 key 的优先级最高，当 key 不一样的，就是销毁创建新的节点，而 key 一样，但 type 不一样，也是销毁创建新的节点，但 key 值能带到性能上的提升，如移动节点也能复用相同 key 的节点，而不设置 key 的节点就没有这方面的优势，只要位置不一样并且 type 不同就销毁创建新的节点，而数组节点需要 key，是因为第二遍历是基于有 key 的前提下的，没有 key，那么都在第一次遍历时结束了，因为它们的 key 都为 null，不可能出现不相同的情况

这就是为什么，我们日常开发时使用了 key 后 type 又一样的情况下，切换了组件，但组件没有重新加载而是出现更新或者组件没有出现预期的状态更新的难以理解的情况
