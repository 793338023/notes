# 不得不了解的 typescript

简要理解 TypeScript ，就是相对于 JavaScript ，除了静态类型外没带来任何东西

# 好处

1. 及早发现错误
2. IDE 支持
3. 易于重构
4. 代码可预测性
5. 类型可以一定程度上充当文档

IDE 支持:
集成开发环境（IDE）让有关类型的信息更加有用 —— 我们可以在 IDE 中使用上代码导航和自动完成等功能，并借助这些准确的建议修复错误。我们还可以在输入代码时获得反馈：编辑器会在错误发生时立即标记出错误，包括与类型相关的错误。这些功能可帮助开发者写出可维护的代码，并带来巨大的生产力提升

什么情况下会重构:

1. 重复性工作，既有的代码无法帮助你轻松添加新特性时
2. 修补 bug 时，排查逻辑困难
3. 太多的代码无注释，已然连自己都无法快速理清代码逻辑

而结合上面的好处，可以发现它大大降低了代码重构的难度

# 入门

[官网](https://www.tslang.cn/docs/handbook/basic-types.html)

# 进阶

入门基本上看官网的手册就行了，ts代码的编写最好是与定义对象靠近，否则查找起来麻烦，而且不要定义冗余，这和我们代码复用问题一样的

## interface 与 type

我们在定义类型时首先考虑使用 interface，但 type 与它的能力是差不多的

而 interface 可同名聚合(声明合并)，只能表示 object、function、class

type 称为别名命名，它可以表示基本类型，联合类型，元组等所有的类型，但不能出现同名(没有声明合并)，而对其扩展需要使用交叉类型&

如:

```ts
interface IProps {
  name: string;
}

interface IProps {
  age: string;
}

// 等价于
interface IProps {
  name: string;
  age: string;
}

type IProps1 = {
  name: string;
};

type IProps2 = {
  age: string;
};

type IProps = IProps1 & IProps2;
```

type 和 interface 对函数的表达

```ts
interface ITextFn {
  (p1: string, p2: number): void;
}

type ITextFn = (p1: string, p2: number) => void;
```

使用 interface 也可以表示构造函数，一般我们会优先使用 class，而非 interface

```ts
interface IAbc {
  new (): { fn1: () => void };
  fn2: () => void;
}

// 等价于

class Abc {
  constructor() {}
  fn1() {}
  static fn2() {}
}
```

而在对函数挂载属性上，type 是做不到的，而 interface 可以

```ts
interface IFn{
    ()=>void;
    text:string;
}
```

而 type 可以理解为对某些类型进行自定义命名，如基本类型，元组，某几个类型的集合等

```ts
type IType1 = number;
type IType2 = [number, string, object];
type IType3 = IType1 | IType2;
```

## 类型扩展

类型扩展的方式有两种，extends 与交叉类型&
​

我们在使用 interface 时都会使用 extends 进行类型扩展，而使用 type 时才会使用&进行扩展
​

如:

```ts
interface IParent {
  a: string;
}

interface IChild extends IParent {
  b: string;
}

type ITChild = { c: number } & IParent;
```

其实交叉类型就是把多个类型合并成一个类型，而 extends 是对已有的类型进行扩展，但不能把已有的类型进行类型覆盖，如

```ts
interface IA {
  a: string;
}

interface IC extends IA {
  a: number;
}

type IB = { a: number } & IA;
```

IC 类型会报错提示类型冲突，但如果是交叉类型&，那么 a 定义会无法推断而变为 never
​

## 泛型

就是不先预设数据类型，而是在具体使用时按约束进行设置类型的方式

泛型可以使用于 interface、type、class、function 中，但它不能使用在 class 的静态成员里

```ts
interface IProps<T> {
  p1: T;
}

type IFn<T> = (a: T) => T;

const fn: IFn<number>;
```

我们也可以把泛型变量理解为函数的参数，只不过是另一个维度的参数，是代表类型而不是代表值的参数。

泛型的好处：

- 函数和类可以轻松的支持多种类型，增强程序的扩展性
- 不必写多条函数重载，冗长的联合类型声明，增强代码的可读性
- 灵活控制类型之间的约束

## 操作符

### typeof

获取一个变量或者对象的类型，方便我们直接根据某个变量或者对象直接推导出它的类型进行定义别的变量或对象上
​

如:

```ts
interface IA {
  a: string;
  obj: {
    q: number;
    c: string;
  };
}

const c: IA;

const b: typeof c.obj;
```

​

### keyof

获取某种类型的所有键值并返回联合类型
​

```ts
interface IA {
  a: string;
  obj: {
    q: number;
    c: string;
  };
}

const c: IA;

const b: keyof IA;
// "a" | "obj"
```

​

### in

只能在 type 定义下使用，interface 不行，用来遍历联合类型，生成映射
如:
​

```ts
type keys = "a" | "b";

type IA = {
  [key in keys]: string;
};

// 等价于
interface IA {
  a: string;
  b: string;
}
```

### extends

除了类型扩展外，它还可以条件限制，extends 在左侧时为约束，在右侧时为条件，而在 type 上使用

```ts
// 约束
type IOc<T extends Promise<any>> = T;
const a: IOc<Promise<number>>;

// 条件
type IOc<T> = T extends Promise<any> ? T : never;
const a: IOc<number>;
```

### infer

extends 条件语句中待推断的类型变量

```ts
type IOc<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

function afn(a: string, b: number) {}
const a: IOc<typeof afn>; // [string,number]
```

从示例上看，type 左边的为约束为函数类型，右边使用条件语句，然后 infer 推断出入参，即返回函数的入参元组

推断 Promise 的返回值

```ts
type IOc<T extends Promise<any>> = T extends Promise<infer P> ? P : T;

const a: IOc<Promise<number>>;
```

## 函数重载

虽然我们有联合类型，可选参数等操作，满足函数重载的场景，但不是所有的场景都满足的，比如需要明确某几种入参类型或入参数量的不同返回值，那么联合类型与可选参数的约束就不够，这时函数重载就很适合使用

```ts
function test(a: number): string;

function test(a: string, b: string): number;

function test(a: any, b?: any) {
  return a + b;
}

test(2);
test("1", "1");
```

## 泛型工具

泛型工具就是内置好的一些泛型工具方法，具体可以搜索`lib.es5.d.ts`文件了解它的实现方式，而它们的前置知识已在上面描述了

1. Partial

将传入的属性变为可选

```ts
interface IProps {
  a: string;
}
const a: Partial<IProps>;
```

2. Required

传入的属性变为必选项

3. Readonly

将传入的属性变为只读选项

4. Record

可以把定义对象都转为同种类型

```ts
interface IProps {
  a: string;
  b: number;
}

const test: Record<IProps, number>;

//test的定义为
interface IProps {
  a: number;
  b: number;
}
```

5. Pick

摘取目标定义的属性

```ts
interface IProps {
  a: string;
  b: string;
  c: string;
}

const test: Pick<IProps, "a" | "b">;

// test定义为
interface IProps {
  a: string;
  b: string;
}
```

6. Exclude

把某些属性移除，一般配合 keyof 使用，因为`"a"|"B"`是可遍历的，可得到移除后的属性值

```ts
interface IProps {
  a: string;
  b: string;
  c: string;
}

type IEkeys = "a" | "b";

const test: Exclude<keyof IProps, IEkeys>;
// test定义为 "c"
```

7. Extract

提取符合要求的属性，与 Exclude 相反

```ts
interface IProps {
  a: string;
  b: string;
  c: string;
}

type IEkeys = "a" | "b";

const test: Exclude<keyof IProps, IEkeys>;
// test定义为 "a"|"b"
```

8. Omit

定义中移除不需要的属性，是 Pick 与 Exclude 组合

```ts
interface IProps {
  a: string;
  b: string;
  c: string;
}

type IEkeys = "a" | "b";

const test: Omit<IProps, IEkeys>;
// test定义为
interface IProps {
  c: string;
}
```

9. ReturnType

得到函数返回值的定义

```ts
function fn(a: string, b?: number) {
  return new Promise<string>((res) => {
    res(a);
  });
}

const test: ReturnType<typeof fn>;
// test定义 Promise<string>
```

10. Parameters

得到函数形参元组定义

```ts
function fn(a: string, b?: number) {
  return new Promise<string>((res) => {
    res(a);
  });
}

const aa: Parameters<typeof fn>;
// test定义 [string,number|undefined]
```

以上是我比较常用的
