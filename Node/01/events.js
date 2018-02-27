const EventEmitter = require('events');
const myEE = new EventEmitter();

myEE.on('foo',() => {
    console.log('foo事件');
});

myEE.on('bar',() => {
    console.log('bar 事件');
});

const sym = Symbol('symbo');
myEE.on(sym, ()=> {
    console.log("symbo");
})
console.log(myEE.getMaxListeners());
console.log(myEE.eventNames());
myEE.emit('bar');