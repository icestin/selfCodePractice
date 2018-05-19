import _ from 'lodash';
import Print  from './print';
 
function component() {
    var element = document.createElement('div');
    var button = document.createElement('button');
    var br = document.createElement('br');
    button.innerHTML = '点击,查看控制台';
    button.onclick = Print.bind(null, "hellow webpack");
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.appendChild(br);
    element.appendChild(button);

    // button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module =>{
    //     var print = module.default;
    //     print();
    // });
    return element;


    // return import(/* webpackChunkName: "lodash" */ 'lodash').then(_=>{
    //     var element = document.createElement('div');
    // }).catch(error =>"在加载组件时发生错误");
   
}

document.body.appendChild(component());
