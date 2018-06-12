## MutationObserver 
Mutation Observer API 用来监视DOM变动，DOM的任何变动，节点的增减、属性的变动文本内容的变动，这个API都可以得到通知。

###与事件的区别
* 事件是同步触发，DOM的变动立刻会触发相应的事件；
* Mutation Observer则是异步触发，DOM的变动不会马上触发，而是等到当前所有的DOM操作都结束才触发。
* 这个差别是为了应付DOM变动频繁的特点。插入 10000个<p> ,会触发10000个插入事件，执行每个事件的回调函数，造成浏览器卡顿； 而Mutation Observer只会在10000个段落插入结束后才触发，且只触发一次。

### Mutation Observer特点
*  等待所有的脚本任务完成，才会运行（异步触发）；
*  将DOM变动记录封装成一个数组进行处理，而不是一条条个别处理DOM变动
*  可以观察DOM的所有类型变动，也可以只观察某一类变动

1. 
```
   var obs = new MutationObserver(callback);
```
2. 
```
 // 回调函数接收两个参数：
 //  变动数组 ； 观察器实例
var obs = new MutationObserver(function (mutations, obs) {
  mutations.forEach(function(mutation) {
    console.log(mutation);
  });
});
```
 3. MutationObserver的实例方法
   observe()方法用来启动监听，它接收连个参数
     p1  domInstance 所要观察的DOM节点
     p2  options  一个配置对象，指定所要观察的特定变动，主要有示例中的三种，需要观察哪种变动类型，就在option对象中指定它的值为true. 必须指定其中的一种或者多种，若未指定，则报错。
     options 还可以指定：
    * subtree: boolean 是否将观察器应用于该节点的所有后代节点
    * attributeOldValue: boolean 观察attributes变动时，是否需要记录变动前的属性值
    * characterDataOldValue：布尔值，表示观察characterData变动时，是否需要记录变动前的值
    * attributeFilter：数组，表示需要观察的特定属性（比如['class','src']）
```
  var article = document.querySelector('#.article');
  var options = {
      'childList' : true,  //子节点变动
      'attributes' : true,  // 属性变动
      'characterData': true, // 节点内容或者节点文本的变动
  };
  obs.observer(article, options);
```
4. disconnect() 用来停止观察。调用该方法后，DOM再发生变动，也不会触发观察器。 takeRecords() 用来清除变动记录，即不再处理未处理的变动，该方法返回变动记录的数组。
```
// 保存所有没有被观察器处理的变动
var changes = mutationObserver.takeRecords();

// 停止观察
mutationObserver.disconnect();
```

### MutationRecord对象
DOM每次发生变化，就会生成一条变动记录（MutationRecord 实例）。该实例包含了与变动相关的信息。
* type：观察的变动类型（attribute、characterData或者childList）。
* target：发生变动的DOM节点。
* addedNodes：新增的DOM节点。
* removedNodes：删除的DOM节点。
* previousSibling：前一个同级节点，如果没有则返回null。
* nextSibling：下一个同级节点，如果没有则返回null。
* attributeName：发生变动的属性。如果设置了attributeFilter，则只返回预先指定的属性。
* oldValue：变动前的值。这个属性只对attribute和characterData变动有效，如果发生childList变动，则返回null。

### 取代DOMContentLoaded事件
网页加载的时候，DOM 节点的生成会产生变动记录，因此只要观察 DOM 的变动，就能在第一时间触发相关事件，因此也就没有必要使用DOMContentLoaded事件
```
var observer = new MutationObserver(callback);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
```
