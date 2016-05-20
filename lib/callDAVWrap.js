var caldav = require("../lib/scrapegoat/lib/index");

var Wrapper = function() {};

Wrapper.prototype.editTask = function (task) {

    var calendarURI = 'https://dav.fruux.com/calendars/a3298237652/31d8603d-1f28-46f9-a440-cafe8dd38b53/';
    var taskURI = calendarURI + task.uuid + '.ics';

    formatTaskToRes(task);

    var config = {
        auth: {
            user: 'b3297510659',
            pass: '62hz43n0jw5q'
        },
        uri: taskURI
    };
    config.eTag = task.eTag;

    var rec = new caldav(config);
    rec.editEvent(task);
}

Wrapper.prototype.sendTask = function (task) {

    var calendarURI = 'https://dav.fruux.com/calendars/a3298237652/31d8603d-1f28-46f9-a440-cafe8dd38b53/';
    var taskURI = calendarURI + task.uuid + '.ics';

    formatTaskToRes(task);

    var config = {
        auth: {
            user: 'b3297510659',
            pass: '62hz43n0jw5q'
        },
        uri: taskURI
    };

    var rec = new caldav(config);
    rec.createEvent(task);
}
Wrapper.prototype.getTasks = function (call) {

    var tasksList = [];
    var project;

    var config = {
        auth: {
            user: 'b3297510659',
            pass: '62hz43n0jw5q'
        },
        uri: 'https://dav.fruux.com/calendars/a3298237652/31d8603d-1f28-46f9-a440-cafe8dd38b53/'
    };

    var rec = new caldav(config);

    rec.getCtag().then(function(info) {
        project = info.name;
        rec.getAllEvents().then(function(tasks) {
            //console.log('INFO: ' + JSON.stringify(tasks, null, 4));
            for (var i = 0; i < tasks.length; i++) {
                //if(tasks[i].data.status != 'COMPLETED') {
                    var task = [];
                    tasks[i].project = project;
                    formatResToTask(task, tasks[i]);
                    tasksList.push(task);
                    //console.log(i + "taskas uuidd:" + task.uuid);
                //    console.log(i + "taskas status:" + task.status);
                //console.log(i + "taskas etag: " + task.eTag);
                //    console.log(i + "taskas title: " + task.title);
                //    console.log(i + "taskas entry:" + task.createdAt);
                //    console.log(i + "taskas prior:" + task.priority);
                //    console.log(i + "taskas due:" + task.due);
                //    console.log(i + "taskas proj:" + task.project);
                ////}
            }
            call(tasksList);
        });
    });
}

function formatResToTask(task, input) {

    task.eTag = input.etag;
    task.uuid = input.data.uid;
    task.title = input.data.title;
    task.entry = input.data.createdAt;
    task.status = input.data.status;
    //if (input.data.status == 'NEEDS-ACTION')
    //    task.status = 'pending';
    //else if (input.data.status == 'COMPLETED')
    //    task.status = 'completed';

    if(input.data.priority == null)
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

function formatTaskToRes(task, input) {

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