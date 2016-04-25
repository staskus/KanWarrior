var exec = require('child_process').exec;
var cmd = 'task list';
var text;
var http = require("http");
var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();

var route = require('./lib/controller.js');
route.controller(app);


app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);
})