<<<<<<< HEAD
require('http').createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html'});
    res.end('<h1> Hello world </h1>');
}).listen(3000);
=======
process.nextTick(function() {
    console.log('Tick 1');
})
process.nextTick(function() {
    console.log('Tick 2');
})
setImmediate(function(){
    console.log('immediate 1');
    setImmediate(function(){
        console.log('insert into ');
    })
})
setImmediate(function() {
    console.log('immediate 2');
});
console.log('tick');
>>>>>>> 1657f1040d08ae4143a2a321988393a9fa3d2dfa
