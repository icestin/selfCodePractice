// node.js async/await 继发执行与并发执行
var log = console.log;
// 定义两个异步函数
function foo () {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            log('foo: ' + new Date().toLocaleString());
            resolve('foo');
        }, 2000);
    })
}

function bar () {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            log('bar: ' + new Date().toLocaleString());
            resolve('bar');
        }, 2000);
    })
}

// 继发执行 
async function main() {
    log("-------------继发执行1---------------------");
    log("beginTime: " + new Date().toLocaleString());

    var foostr = await foo();
    log(new Date().toLocaleString());

    log(foostr);

    var barstr  = await bar();
    log(new Date().toLocaleString());

    log(barstr );

    log("endTime :" + new Date().toLocaleString());

}

// 继发关系比较耗时，因为只有前一个await完成以后，才会执行后一个await
// main(); // 继发执行 1

async function main2() {
    // 通过for循环实现继发执行
    log("-------------继发执行2---------------------");
    let docs = [foo, bar];
    log("beginTime: " +new Date().toLocaleString());
    for (let doc of docs ) {
        var str = await doc();
        log(new Date().toLocaleString());
        log(str);
    }
    log("endTime:" + new Date().toLocaleString());
}
// main2();  // 继发执行2

async function async_main() {
    log("-------------并发执行1---------------------");
    log('beginTime:'+new Date().toLocaleString());
    let [get_foo, get_bar] = await Promise.all([foo(), bar()]);
    log(new Date().toLocaleString());
    log(get_foo);
    log(get_bar);
    log("endTime:"+ new Date().toLocaleString());
}
// async_main();// 并发执行

async function async_main2() {
    log("-------------并发执行2---------------------");
    let docs = [foo(), bar()];
    log("beginTime: "+ new Date().toLocaleString());
    for (let doc of docs) {
        var str = await doc;
        log(new Date().toLocaleString());
        log(str);
    }
    log("endTime:" + new Date().toLocaleString());
}
// async_main2();

async function async_main3() {
    log("-------------并发执行3---------------------");
    log("startTime:"+new Date().toLocaleString());
    let fooPromise = foo();
    let barPromise = bar();
    let get_foo = await fooPromise;
    log(new Date().toLocaleString());
    log(get_foo);
    let get_bar = await barPromise;
    log(new Date().toLocaleString());
    log(get_bar);
    log("endTime:"+new Date().toLocaleString());
    
}
// async_main3();

// 并发执行 4
async function async_main4 () {
    log("-------------并发执行3---------------------");
    log("startTime:"+new Date().toLocaleString());
    let docs = [foo, bar];
    // for 循环是继发执行
    // forEach循环是并发执行
    docs.forEach( async (val) => {
        var str = await val();
        log(new Date().toLocaleString());
        log(str);
    })
    log("endTime:"+new Date().toLocaleString());
}

async_main4();