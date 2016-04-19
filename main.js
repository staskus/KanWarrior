var exec = require('child_process').exec;
var cmd = 'task list';
var text;
var http = require("http");
var fs = require('fs');
var url = require('url');
var task = require("./lib/Task");
var express = require('express');

var app = express();

//task.getOutput("list",(text)=> {
//});


exec(cmd, function(error, stdout, stderr) {
  //console.log(stdout);
  text=stdout;
});

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