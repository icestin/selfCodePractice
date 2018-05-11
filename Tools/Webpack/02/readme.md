

## 资源管理
webpack最出色的功能之一就是除了JavaScript，还可以通过loader引入其他类型的文件。

### 加载CSS
为了从javscript模块中import一个css, 需要在module配置中安装并添加style-loader和css-loader:
* npm install --save-dev style-loader css-loader
webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的loader.
使用户在依赖此样式的文件中 import './style.css. 当模块运行时，含有CSS字符串的<style> 标签将被插入到hmtl<head>中。

### 加载图片 
* npm install --save-dev file-loader
当 import MyImage from './my-image.png' 该图像将被处理并添加到output目录，并且 MyImage变量将包含该图像在处理后的最终url,  当使用css-loader时， css中的url('./my-image.png'),loader会识别出这是一个本地文件， 并将'./my-image.png'路径替换为输出目录的图像路径最终路径， html-loader会以同样的方式处理 <img src='./my-image.png/>

### 加载文字 
配置好 loader 并将字体文件放在合适的地方，可以通过一个 @font-face 声明引入。本地的 url(...) 指令会被 webpack 获取处理，就像它处理图片资源一样

### 加载数据
  可以加载的有用资源还有数据，JSON, import Data from './data/json'默认正常运行， 要导入CSV,TSV,XML可以使用 csv-loader 和xml-loader
 * npm install --save-dev csv-loader xml-loader

### 全局资源组织方式
  将资源与代码组合在一起，类似于：
 ```
   |- /components
   |  |- /my-components
   |  |  |- index.jsx
   |  |  |- index.css
   |  |  |- index.svg
   |  |  |- img.png
 ```
 这种配置方式使代码更具可移植性，
 