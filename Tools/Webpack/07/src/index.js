// import _ from 'lodash';
 
// 不再使用静态导入 lodash, 而是通过动态导入来分离一个 chunk:
function getComponent() {
    return import(/* webpackChunkName: "lodash" */ 'lodash').then(_=>{
        var element = document.createElement('div');
        // Lodash 现在由脚本导入
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        return element;
    }).catch(error =>"在加载组件时发生错误");
   
}
getComponent().then(component => {
    document.body.appendChild(component);
});