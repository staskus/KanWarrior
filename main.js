var exec = require('child_process').exec;
var cmd = 'task list';
var text;
var http = require("http");
var fs = require('fs');
var url = require('url');
var Task = require("./lib/Task");
var taskManager = require("./lib/TaskManager");
var express = require('express');

var app = express();


app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
   //res.send('Hello World');
   res.render('index.html');
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})