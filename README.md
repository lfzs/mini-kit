# mini-kit 小程序脚手架

## CLI

补充 project.config.json.example 的 projectname 和 appid ,`cp project.config.json.example project.config.json`

使用 CI 部署时，需要补充 private.key

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

- 修改 Mobx 的 observable 强制使用 action

- 当页面使用 store 数据时，在执行 onLoad 前，data 中并没有 store 数据，这一次页面拿到的数据是有问题的。
当开始执行 onLoad 时，其中注册 autorun 会更新 data，把 store 的放置到 data 中，这一次页面才会真正拿到 store 里的数据。后面更新数据会再次更新 data

- gulp 在新建或者删除文件时，`gulp.watch`并不会执行，需要重新执行 gulp 编译操作
