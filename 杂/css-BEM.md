## BEM 规范

BEM 是一种命名 CSS 样式的命名方法和规范，全称 Block（块）、 Element（元素）、 Modifier（修饰符）。

Block：一般可以看做是独立具有实际意义的模块部分，例如 header,container,menu 等

Element：组成 Block 的一部分，没有具体的实际意义，一般也不独立使用，例如 menu item，list item，header title 等

Modifier：一般是块或者元素的修饰状态或者行为，例如 disabled，color，checked 等

而 BEM 的写法一般是.block-name**element-name--modifier-name，其中 Block 与 Element 之间连接是通过 ** 双下划线，Block，Element 与 Modifier 之间是通过 -- 双中划线进行连接，当使用 less 或者 sass 语法编写 css 时，通过嵌套语法也能够很简洁的书写这部分样式。

```
<div class="head">
	<div class="head__title">
    标题
    <div class="head__title--disabled">
      置灰内容
    </div>
  </div>
</div>

```

```
.head {
  background-color: #fff;
  &__title {
    font-size: 14px;
    color: #666;
    &--disabled: {
    	color: #f00;
    }
  }
}

```

BEM 命名规范可以让样式的命名更加模块化，组件之间结构独立，减少了命名之间的冲突，有着不错的易读性、维护性等等，但可能会让项目中的样式命特别的长。

包裹类： container, wrapper, outer, inner, box, header, footer, main, content, aside, page, section, block
状态类： primary, secondary, success, danger, warning, info, error, Link, light, dark, disabled, active, checked, loading
尺寸类： large, middle, small, bigger, smaller
组件类： card, list, picture, carousel, swiper, menu, navs, badge, hint, modal, dialog
位置类： first, last, current, prev, next, forward, back
文本类： title, desc, content, date, author, category,label,tag
人物类： avatar, name, age, post, intro

## 文件名称

kebab-case：横短线命名，也叫串式命名法，小写字母的词组，中间加 - 拼接的方式，这种方式命名便于同类内容快速查找

```
// good
news-index;
news-list;
news-detail;
```

camelcase：小驼峰命名，第一个单字以小写字母开始，第二个单字的首字母大写

```
// good
newsIndex;
newsList;
newsDetail;
```
