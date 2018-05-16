## 模块热替换

Hot Module Replacement HMR ==> webpack 允许在运行时更新各种模块，而无需进行完全刷新
模块热替换功能会在应用程序运行过程中替换、添加或者删除模块，而无需加载整个页面。主要是通过以下几种方式来加快开发速度：
 * 保留在完全重新加载页面时丢失的应用程序状态。
 * 只更新变更内容，以节省宝贵的开发时间
 * 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式
HMR 不适用于生产环境
1. 更新webpack-dev-server配置，使用内容插件HMR


#### HMR修改样式表
借助于style-loader, 当更新CSS依赖模块时， 该loader在后台使用module.hot.accept来修补（patch）<style>

1. React Hot Loader : 实时调整react组件
2. Vue Loader : 
3. Elm Hot Loader:
3. Redux HMR:  无需loader或插件，只需对mian store进行简单修改
4. Angular HMR: