var first = document.getElementById("number1");
var second = document.getElementById("number2");
var result = document.getElementById("result");

if (!!window.SharedWorker) {
    var myWorker = new SharedWorker('worker.js');

    first.onchange = function() {
        myWorker.port.postMessage([first.value, second.value]);
    }

    second.onchange = function() {
        myWorker.port.postMessage([first.value, second.value]);
    }

    myWorker.port.onmessage = function (e) {
        result.textContent = e.data;
        console.loog('multiply 返回值',e);
    }

}else{
    console.log('不支持');
}