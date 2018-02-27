var bytes = new Buffer(15);

for (var i = 0; i < bytes.length; i++) {
    bytes[i] = i;
}
var end = bytes.slice(0, 10);

console.log(bytes);
console.log(end);

var copy = new Buffer(5);
end.copy(copy, 1, 4, 8); // 空位置由0补充
console.log("copy 结果",copy);

// Buffer.concat();
var v1 = new Buffer('Hello');
var v2 = new Buffer(' ');
var v3 = new Buffer('World');
// var res = Buffer.concat([v1, v2, v3], length = int); length 指定合并对象的总长度
var res = Buffer.concat([v1, v2, v3]);
console.log('合并后的结果', res, "after .toString()：",res.toString());
