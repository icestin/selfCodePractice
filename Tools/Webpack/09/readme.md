## 渐进式网络应用程序
 Progressive Web Application 

启动http-server dist后，我们可以访问dist目录下的内容，并可以访问webpack应用程序，如果停止服务器后刷新，则webpack应用程序不再可访问，
而PWA在停止服务器然后刷新，仍然可以查看应用程序正常运行。

### 添加 Workbox
```
  npm install workbox-webpack-plugin --save-dev
```
### 注册Service Worker
```
if ('serviceWorker' in navigator) {
  window.addEventListener('load',() => {
      navigator.serviceWorker.register('service-worker.js').then(registration => {
          console.log('SW registered:', registration);
      }).catch(registerError => {
          console.log("SW 注册失败:", registerError);
      })
  })
}
```
