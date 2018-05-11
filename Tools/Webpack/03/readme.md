## 管理输出
  随着应用程序增长，需要对文件名使用哈希（hash)并输出多个bundle,可以通过一些插件使管理更容易操控

  ### HtmlWebpackPlugin 
  npm install --save-dev html-webpack-plugin
  可以修改index.html文件的内容, html-webpack-plugin 会将新生产的页面替换掉原来的页面。

  ### 清理 /dist文件夹 clean-webpack-plugin插件
  npm install clean-webpack-plugin --save-dev

  ### Manifest 
   通过manifest, webpack能够对 [模块映射到bundle的过程]保持追踪