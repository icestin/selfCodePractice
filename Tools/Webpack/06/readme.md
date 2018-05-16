## 生产环境 
 === 
* 开发环境 development: 需要实时重新加载(live reloading) 或者热模块替换（hot module replacement)能力的source map 和localhost server
* 生产环境 production 关注更小的bundle更轻量的source map,以及更优化的资源，

### 为每个环境编写彼此独立的webpack配置
将生产环境和开发环境做略微区分，并保留通用配置，通过webpack-merge，将配置合并在一起。
npm install --save-dev webpack-merge

* 通过使用webpack-merge工具将webpack.common.js分别与webpack.dev.js 以及webpack.prod.js
*  npm start :  "webpack-dev-server --open --config webpack.dev.js"
*  npm build :  "webpack --config webpack.prod.js"

NODE_ENV 是一个由Node.js暴露给执行脚本的系统环境变量。通常用于决定在开发环境与生产环境(dev-vs-prod)下，服务器工具、构建脚本和客户端library的行为。然而与预期不同的是，无法再构建脚本webpack.config.js中将process.env.NODE_ENV设置为'production',例如
process.env.NODE_EVN ==="production" ? '[name].[hash].bundle.js':'[name].bundle.js' 这样的条件语句在webpack配置文件中，无法按照预期运行。
```
new webpack.DefinePlugin({
   'process.env.NODE_ENV': JSON.stringify('production')
 })
```

--optimize-minimize标记将在后台引用 UglifyJSPlugin与DefinePlugin实例相同， --define process.env.NODE_ENV = "'production'"结果一致。
推荐使用配置方式，可以更方便控制这两个插件中的其他选项。
