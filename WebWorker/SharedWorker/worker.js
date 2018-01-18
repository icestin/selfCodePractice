console.log('worker.js',e);
onconnect = function(e) {
    console.log('onconnect',e);
    var port = e.ports[0];
    port.onmessage = function(e) {
        var workderResult = 'Result: ' +(e.data[0] * e.data[1]);
        port.postMessage(workderResult);
    }
}