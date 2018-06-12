##Service Worker 
* Service Worker主要特点：在页面注册并安装成功后，运行于浏览器后台，不受页面刷新的影响，可以监听和拦截作用域范围内所有页面HTTP请求。
* 基于Service Worker的特性，结合Fetch API, Cache API, Push API, postMessage API 和Notification API, 可以基于浏览器的web应用实现如离线缓存、消息推送、静默更新等native常用功能，带来更丰富的使用体验。

 1. Service Worker特点
  * 网站必须使用HTTPS，处理使用本地开发环境调试（localhost)
  * 运行于浏览器后台，可以控制打开的作用域范围下所有的页面请求
  * 单独的作用域范围，单独的运行环境和执行线程
  * 不能操作DOM, 但可以通过事件机制来处理
 2. Service Worker的生命周期
  install -> installed -> actvating ->Active -> Activated ->Redundant
    进入Redundant（废弃）状态可能原因： 
     * 安装（install）失败
     * 激活（activating）失败
     * 新版本的 Service Worker替换了它成为激活状态
  
  3. 使用 Service Worker 
      https Or localhost
 ```
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw/sw.js', {scope: '/'}).then(
       registration => console.log("注册成功");
     )
   }
 ```
   * Service Worker的注册路径决定了scope的默认作用范围，示例sw.js是在/sw/路径下，则该Service Worker默认只会接收到 /sw/路径下的fetch事件，如果希望改变其作用域，可以设置第二个参数scope范围。 示例会对整个站点生效。
   * Service Worker没有页面作用域的概念，作用域反问内的所有页面请求都会被当前激活的Service Worker所监控
  
