# mini-kit 小程序脚手架

## util/page.js

对小程序的 Page 进行一层拦截，注入 mobx 的 autorun。将 onLoad 挂载到页面上，使用组件 loading-screen 调用

然后在 app.js 中引入，这样所有的页面就都能使用这个被修饰过的 Page

## util/fetch-action.js

主要用来装饰 store 的 fetchData 方法，监听请求是否完成，并添加 tryFetchData 方法(不需要 tryFetchData 方法，不建议使用)

## store/hepler/Cache.js

将需要缓存的 store 缓存到内存中

## store/helper/List.js

列表 store 可继承使用

## 注意事项

- gulp 在新建或者删除文件时，`gulp.watch`并不会执行，需要重新执行 gulp 编译操作

- 集成了 weui (https://developers.weixin.qq.com/miniprogram/dev/extended/weui/) 组件库，使用时在 usingComponents 中声明即可。例： `"mp-icon": "/weui-miniprogram/icon/icon"`

- weui 使用的是 px 做单位

- 需要修改 weui 组件内部样式，每个组件可以设置 ext-class 这个属性，该属性提供设置在组件 WXML 顶部元素的 class

- weui 组件的 addGlobalClass 的 options 都设置为 true，所以可以在页面设置 wxss 样式来覆盖组件的内部样式
