## 缓存
通过必要的配置确保webpack编译生成的文件能够被客户端缓存，而在文件内容变化后能够请求到新的文件
###输出文件的文件名 Output Filenames
通过output.filename进行文件名替换，可以确保浏览器获取到修改后的文件。
[hash]替换可以用于在文件名中包含一个构建相关（build-specific)的hash
[chunkhash] 在文件中包含一个chunk相关的（chunk-specific）哈希。

### 提取模板（extracting Boilerplate)
CommonsChunkPlugin可以用于将模板分离到单独的文件中，并且 通过指定entry配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中
* 将第三方库 如 lodash或者react提取到单独的vendor chunk文件中，可以利用客户端的缓存机制，命中缓存来消除请求， 并减少向服务器获取资源，还能保证客户端代码和服务器端代码一致。

### 模块标识符 （Module Identifiers)
 每个module.id会基于默认的解析顺序（resolve order)进行增量，当解析顺序发生变化， ID也会随之改变， 
 * main bundle 会随着自身的新增内容的修改，而发生变化
 * vendor bundle 会随着自身的module.id的修改，而发生变化
 * manifest bundle 会因为当前包含一个新模块的引用，而发生变化
 vendor的hash发生变化需要修复。 可以用插件来解决这个问题，**NameModulesPlugin** ,使用模块的路径，而不是数字标识符。 **HashedModuleIdsPlugin** 推荐用于生产环境