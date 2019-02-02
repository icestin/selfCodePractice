var b = {
     a: 'aaa',
     b: 'bbb',
     c: 'ccc',
     d: 'ddd'
}

var sleep = async (delay) => new Promise((resolve, reject)=>setTimeout(resolve, delay)) ;

(async ()=> {
    console.time('countTime');
    console.log('ahead sleep');
    await sleep(5000);
    console.log('after the sleep');
    console.timeEnd('countTime');
    await testLoopObj();
})()


var testLoopObj = async () => {
    for(let ii in b) { // 会继发执行该函数
        await sleep(2000);
        console.log(b[ii]);
    }
}