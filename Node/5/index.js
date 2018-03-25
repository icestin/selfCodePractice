'use strict';

var fs = require('fs');

fs.readFile('a.txt','utf-8',function(err,data){
    if (err) {
      console.log(err);
    }else {
        console.log(data);
    }
})

fs.readFile('img1.png',function(err,data){
    if (err) {
      console.log(err);
    }else {
        console.log(data);
        console.log(data.length + 'bytes');
    }
})

var toWrite = 'Hello , node js';
fs.writeFile('output.txt', toWrite, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('write ok');
    }
});

//获取文件信息
fs.stat('output.txt', function (err, stat) {
    if(err) {
        console.log(err);
    } else {
        // 是否是文件
        console.log('isFile:' + stat.isFile());
        // 是否是目录
        if (stat.isFile()) {
            // 文件大小
            console.log('size:' + stat.size);
            // 创建时间， Date对象
            console.log('创建日期'+ stat.birthtime);
            // 修改时间
            console.log('nodified time: ' + stat.mtime);
        }
    }

})

