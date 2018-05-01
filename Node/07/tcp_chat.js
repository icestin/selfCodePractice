var net = require('net');

/***
 * 追踪连接数
 */
var count = 0
    ,users = {};


/**
 * 创建服务器
 */
var server = net.createServer(function (conn) {
    console.log('\033[90m new connection! \033[39m');
    conn.write(
        '\n > welcome to \033[92m node-chat \033[39m!'
        + '\n >' + count + ' other people are connected at this time.'
        + '\n > please write your name and press enter:'
    );
    count++;

    conn.setEncoding('utf8');  
    
 conn.on('close', function () {
    count--;
    delete users[nickname];
});
   var nickname ;

    conn.on('data', function(data) {

        // console.log(data);
        //  删除回车符
        data = data.replace('\r\n', '');
        // 接受到的第一份数据应当是用户输入的昵称 
        if (!nickname) {
            if (users[data]) {
                conn.write('\033[93m > nickname already in user, try again: \033[39m ');
                return;
            }
            else {
                nickname = data;
                users[nickname] = conn;
                for (var i in users) {
                    if (i != nickname) {
                        users[i].write('\033[96m > ' + nickname + ' : 033[39m '+ data+ '\n');
                    }
                    users[i].write('\033[90m > ' + nickname + ' joined the room\033[39m \n')
                }
            }
        }
    })
    
});


/****
 * 监听
 */

 server.listen(3000, function () {
     console.log('\033[96m server listenning on *：3000\033[39m');
 })
