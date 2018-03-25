'use strict'

var fs = require('fs');
// 打开一个流

var rs = fs.createReadStream('aa.txt','utf-8');
rs.on('data', function(chunk) {
    console.log('data:');
    console.log(chunk);
});
rs.on('end', function() {
    console.log('读取结束');
})
rs.on('err', function(err) {
    console.log("错误", err);
});

// 以流的形式写入文件
var ws1 = fs.createWriteStream('output1.txt','utf-8');
ws1.write('使用Stream写入文本数据...\n');
ws1.write('END');
ws1.end();

var ws2 = fs.createWriteStream('p.txt');
ws2.write(new Buffer('使用Stream写入二进制数据....\n','utf-8'));
ws2.write(new Buffer('END', 'utf-8'));
ws2.end();
console.log('end of Stream');

//像水管可以串起来一样，两个流也可以串起来。
// 一个Readable流和一个Writable流串起来后 所有的数据从Readable
// 流入Writable流，这种操作叫做pipe
//在Readable流中有一个pepe()方法

var rsF = fs.createReadStream('output1.txt');
var wsT = fs.createWriteStream('copied.txt');
rsF.pipe(wsT);
console.log('end of pipe');