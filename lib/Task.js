var exec = require('child_process').exec;
var util = require('util');
var exports = module.exports = {};
var text;



exports.getOutput = function getOutput(input,fn) {

    text = exec(`Task ${input}`, function (err, stdout) {

        fn(stdout);

    })
}


