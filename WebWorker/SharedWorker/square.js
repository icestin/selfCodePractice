var squaredN = document.getElementById('number3');
var result2 = document.getElementById('result2');
console.log('square',e);

if(!!window.SharedWorker) {
    var myWorker = new SharedWorker('worker.js');
    squaredN.onchange = function() {
        myWorker.port.postMessage([squaredN.value,squaredN.value]);
    }
    myWorker.port.onmessage = function(e) {
        result2.textContent = e.data;
        console.log(e);
    }
}else{
    console.log('不支持');
}