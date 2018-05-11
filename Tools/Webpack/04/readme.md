## 开发

### 使用 source map
当webpack打包源码时，会将多个源码打包到bundle文件中。其中一个源文件包含错误会追踪到bundle.js中。需要追踪错误和警告。JavaScript提供了 source map 功能。将编译后的代码映射回原代码。
 devtool: 'inline-source-map',

### 使用webpack-dev-server 
 搭建简单web服务器，实现实时重新加载 live reloading
 npm install -save-dev webpack-dev-server
   添加 目录 dist 作为可访问文件
   devServer: {
       contentBase: './dist'
    },

### 使用 webpack-dev-middleware
是一个容器，可以把webpack处理后的文件传递给一个服务器，webpack-dev-server在内部使用了它
