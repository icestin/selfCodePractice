import _ from 'lodash';
import printMe from './print.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load',() => {
      navigator.serviceWorker.register('service-worker.js').then(registration => {
          console.log('SW registered:', registration);
      }).catch(registerError => {
          console.log("SW 注册失败:", registerError);
      })
  })
}

function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    btn.innerHTML = 'Click me and check the '
    btn.onclick = printMe;
    element.appendChild(btn);
    return element;
}
document.body.appendChild(component());