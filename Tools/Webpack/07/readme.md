## 代码分离
代码分离能够将代码分离到不同的bundle中，然后可以按需加载这些文件。 代码分离可以用于获取更小的bundle,以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

### 三种常用代码分离方法： 
* 入口起点： 使用entry配置手动的分离代码。
* 防止重复： 使用CommonsChunkPlugin去重和分离chunk。
* 动态导入： 通过模块的内联函数调用来分离代码。

#### 入口起点 entry points
* 如果入口chunks之间含有重复的模块，重复模块都会被引入到各个bundle中。
* 不够灵活，不能将核心应用程序逻辑进行动态拆分代码。
可以通过CommonsChunkPlugin来移除重复模块。

### 防止重复 CommonChunkPlugin 等
 该插件可以将公共的依赖模块提取到已有的入口chunk中，或者提取到一个新的chunk中。
ExtractTextPlugin： 用于将CSS从主程序中分离
bundle-loader: 用于分离代码和延迟加载生成的bundle.
promise-loader: 类似于bundle-loader，但使用的是promises.
### 动态导入 dynamic imports
* 优先选择 ECMAScript提案中 import语法
* webpack中特定的require.ensure.

=== 

## 懒加载
懒加载： 先把你的代码逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用程序的加载速度，减轻了它的总体积， 有些代码模块可能永远不会被加载
