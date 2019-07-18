/**
 *  promise 验证
 */

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

 const loopCount = 5;
 async function testPromiseFor(){
     for(let i = 0; i < loopCount; i++) {
       await handle();
     }
 }
let count = 0;


 let handle =  async function () {

   await sleep(1000)
   .then(result =>{
        console.log('计数器值 ', count++, ' 将等待10秒');
        return sleep(10000);// 
    }).then(end=>{
        console.log('函数执行结束 ');
    });

 }

;(async()=>{

    testPromiseFor();

 })()