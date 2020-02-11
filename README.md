# mini-kit 小程序脚手架

## util/page.js

对小程序的Page进行一层拦截,注入mobx的autorun、将onLoad挂载到页面上使用组件loading-screen调用

然后在app.js中引入,这样所有的页面就都能使用这个被修饰过的Page

## util/fetch-action.js

主要用来装饰store的fetchData,监听请求是否完成.并添加tryFetchData方法(不需要tryFetchData方法，不建议使用)

## store/cache.js

将需要缓存的 store 缓存到内存中，新建 store 的时候要保证 name 是全局唯一的。例如：订单列表可以使用 orderList , 订单详情可使用 order1、order2...

## store/List.js

调用 List.findOrCreate 可创建列表 store

## store/Item.js

调用 Item.findOrCreate 可创建详情 store。Item 实例的时候会执行 autorun 监听 data 的变化，更新到对象的 list

## 注意事项

- gulp 在新建或者删除文件时, `gulp.watch`并不会执行, 需要重新执行gulp编译操作

- 集成了 weui (https://developers.weixin.qq.com/miniprogram/dev/extended/weui/) 组件库, 使用时在 usingComponents 中声明即可。例： `"mp-icon": "/weui-miniprogram/icon/icon"`

- weui 使用的是 px 做单位

- 需要修改 weui 组件内部样式, 每个组件可以设置 ext-class 这个属性，该属性提供设置在组件 WXML 顶部元素的 class

- weui 组件的 addGlobalClass 的 options 都设置为 true ，所以可以在页面设置 wxss 样式来覆盖组件的内部样式。需要注意的是，如果要覆盖组件内部样式，必须 wxss 的样式选择器的优先级比组件内部样式优先级高
