onmessage = function(e) {
    console.log('从主界面获取信息', e);
    var workerReault = 'Result:' +(e.data[0] *e.data[1]);
    postMessage(workerReault);
}