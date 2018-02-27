var cluster = require('cluster');
if (cluster.isMaster) {
    require('./master');
    return;
}

var express = require('express');
var http = require('http');
var app = express();

app.get('/',function(req, res){
   res.send("from &&7");
});

http.createServer(app).listen(8080, function(){
    console.log('http://localhost:8080');
});
