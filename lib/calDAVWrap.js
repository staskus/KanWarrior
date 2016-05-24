var caldav = require("../lib/scrapegoat/lib/index");

var Wrapper = function() {};

var config;
var uri;

Wrapper.prototype.setCredentials = function (authorization, callback) {

    config = {
        auth: {
            user: authorization.user,
            pass: authorization.pass
        },
        uri: authorization.uri
    };
    uri = authorization.uri;
    var rec = new caldav(config);
    rec.getCtag().then(function(res){
       callback(res.name);
    });
}

Wrapper.prototype.editTask = function (task) {

    formatTaskToRes(task);
    config.uri = uri + task.uuid + '.ics';
    config.eTag = task.eTag;

    var rec = new caldav(config);
    rec.editEvent(task);
}

Wrapper.prototype.sendTask = function (task) {

    formatTaskToRes(task);
    config.uri = uri + task.uuid + '.ics';
    var rec = new caldav(config);
    rec.createEvent(task);
}

Wrapper.prototype.getTasks = function (callback) {

    var tasksList = [];
    var project;

    config.uri = uri;
    var rec = new caldav(config);
    rec.getCtag().then(function(info) {
        project = info.name;
        rec.getAllEvents().then(function(tasks) {
            if(tasks!=null)
            for (var i = 0; i < tasks.length; i++) {
                    var task = [];
                    tasks[i].project = project;
                    formatResToTask(task, tasks[i]);
                    tasksList.push(task);
            }
            callback(tasksList);
        });
    });
}

function formatResToTask(task, input) {

    task.eTag = input.etag;
    task.uuid = input.data.uid;
    task.title = input.data.title;
    task.entry = input.data.createdAt;

    if (input.data.status == 'NEEDS-ACTION')
        task.status = 'pending';
    else if (input.data.status == 'COMPLETED')
        task.status = 'completed';

    if(input.data.priority == null || input.data.priority <= 0)
        task.priority = '';
    else if (input.data.priority <=3)
        task.priority = 'H';
    else if (input.data.priority <=7)
        task.priority = 'M';
    else
        task.priority = 'L';

    if(input.data.due != null)
        task.due = input.data.due;
    else
        task.due = '';
    task.project = input.project;
}

function formatTaskToRes(task) {

    task.rand = generateUID();
    if(task.priority == null)
        task.priority = '';
    else if (task.priority == 'H')
        task.priority = 1;
    else if (task.priority == 'M')
        task.priority = 5;
    else
        task.priority = 9;
    if (task.status == 'pending')
        task.status = 'NEEDS-ACTION';
    else if (task.status == 'completed')
        task.status = 'COMPLETED';
}

function generateUID() {
    var rand = '';
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 36; i++ )
        rand += possible.charAt(Math.floor(Math.random() * possible.length));
    return rand;
}

module.exports = new Wrapper();