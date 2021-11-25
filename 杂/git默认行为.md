push.default 选项
push.default 有几个可选值: nothing, current, upstream, simple, matching


nothing
什么都不推送除非显示地指定远程分支。


current
推送当前分支到远程同名分支，如果远程不存在，则创建同名分支。

```
git config push.default current
```

upstream
推送当前分支到 upstream 分支上，因此必须有 upstream 分支，这种模式通常用于从一个仓库获取代码的情景。


simple
和 upstream 类似，不同点在于，必须保证本地分支与 upstream 分支同名，否则不能 push。


matching
推送所有本地和远程两端都存在的同名分支。


在 Git2.0 之前 push.default 默认值为 matching，2.0 之后默认值为 simple，没有 upstream 不能被推送。

