var cluster = require('cluster');
var os = require('os');
var http = require('http');

if (cluster.isMaster) {
    var numWorkers = os.cpus().length;
    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i ++) {
        cluster.fork();
    }
    // 一旦work进程挂了，可以通过部署online事件和exit事件进行监听
    cluster.on('online', function(worker){
           console.log('Worker ' + worker.process.pid + ' is oline')
    });
    cluster.on('exit', function(worker, code, signal){
        console.log("Worker " + worker.process.pid + ' died with code:' + code + ' and signal:' + signal);
        console.log("Starting a new worker");
       var worker =  cluster.fork();
       worker.send('Hi from worker');
    });

    process.on('message', function(msg) {
        msg += "new new "
        console.log("message event :",msg);
        process.send(msg);
    })

} else if (cluster.isWorker ) { 
    //在 worker中，要向主进程发送消息，使用process.send(message); send 可以是string or JSON
    // 要监听主进程发出的消息， on("message") 事件
    process.on('message', function(msg) {
       console.log("message event :",msg);
       process.send(msg);
    })
}
else { // 说明当前进程是worker进程
    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000);
}

// cluster.workers 对象
function eachWorker (callback) {
    for (var id in cluster.workers) {
        callback(cluster.workers[id]);
    }
}
eachWorker(function(worker){
    worker.send("message from worker:" + worker.id);
    worker.kill('SIGKILL');
});

cluster.on('listening', function (workder, address){
    console.log("A worker is now connected to" + address.address +":" + address.port);
});