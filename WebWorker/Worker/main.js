var first = document.querySelector('#number1');
var second = document.querySelector('#number2');
var result = document.querySelector('#result');
if(window.Worker){
    var myWorker = new Worker('worker.js');
    
    first.onchange = function(){
        myWorker.postMessage([first.value,second.value]);
    }
    second.onchange = function(){
        myWorker.postMessage([first.value,second.value]);
    }
    myWorker.onmessage = function(e) {
        result.textContent = e.data;
    }
}