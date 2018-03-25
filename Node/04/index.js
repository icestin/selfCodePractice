process.nextTick(function() {
    console.log("nextTick callback");
});

process.on('exit', function(code) {
    console.log('about to exit with code:' + code);
});
// 判断JavaScript的执行环境
if (typeof(window)==='undefined') {
    console.log('run in node.js');
} else {
    console.log('run in browser');
}
console.log('nextTick was set!');