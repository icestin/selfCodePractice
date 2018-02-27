const fs = require('fs');
const { Console } = require('console');
// const { Console } = console;


const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');

 // 自定义简单的记录器

 const logger = new Console(output, errorOutput);

 const count = 15;
 logger.log('count: %d', count); 
//  const a = logger.assert(true, 'does nothing');
//  const a = console.assert(false, 'does nothing');
//  const a = console.assert(false, 'does nothing');
//  console.log(a);
//  logger.log('ll',a);
 process.argv.forEach((val, index)=> {
     console.log(`${index}:${val}`);
 });
// process.argv0
const startUsage = process.cpuUsage();

const now = Date.now();
while( Date.now() - now < 500);
console.log(process.cpuUsage(startUsage));

console.log(`Current directory: ${process.cwd()}`);
console.log(`Current connected: ${process.connected}`);
console.log(`Current env: ${process.env}`);

console.log("start");
process.nextTick(()=>{
    console.log('nextTick callBack');
});
console.log("end");

var num1, num2;
process.stdout.write('请输入num1的值');

process.stdin.on('data',function (chunk){
     if(!num1) {
         num1 = Number(chunk);
         process.stdout.write('请输入num2的值');
     }else {
         num2 = Number(chunk);
         process.stdout.write('结果是：' +(num1 + num2));
     }
});