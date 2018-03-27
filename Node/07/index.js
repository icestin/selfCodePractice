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