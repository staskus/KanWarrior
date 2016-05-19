var caldav = require("../lib/scrapegoat/lib/index");

var Wrapper = function() {};

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
        //uri: 'https://dav.fruux.com/calendars/a3298237652/42320941-db99-4e3f-ab71-8c15d58baab2/'
        //uri: 'https://dav.fruux.com/calendars/a3298237652/300cc743-fd64-4386-a3d2-d88ecf10894e/' //MAIN
    };

    var rec = new caldav(config);


    //rec.getCtag().then(console.log);
    //rec.getEtags().then(function (res) {
    //    console.log("ISETAG: " + JSON.stringify(res, null, 4));
    //    var events = [
    //        { ics: res[0].ics }
    //    ];
    //    rec.getEvents(events).then(function (res) {
    //        console.log("ISEVENTU: " + JSON.stringify(res, null, 4));
    //    });
    //    //console.log ('ics: '+res[0].ics);
    //});

    //rec.getEvents();
    rec.createEvent(task);
    //.then(function(tasks) {
    //    //console.log(tasks);
    //});
}
Wrapper.prototype.getTasks = function (call) {

    //var username = 'b3297510659';
    //var password = '62hz43n0jw5q';
    //var caldav_baseurl = 'https://dav.fruux.com';

    var tasksList = [];
    var project;

    var config = {
        auth: {
            user: 'b3297510659',
            pass: '62hz43n0jw5q'
        },
        uri: 'https://dav.fruux.com/calendars/a3298237652/0802300b-080b-425e-b4dd-076958dcb3f8/'
        //uri: 'https://dav.fruux.com/calendars/a3298237652/b2926bc0-8e29-4b40-8cff-41195fdd2754/'
    };

    var rec = new caldav(config);

    rec.getCtag().then(function(info) {
        project = info.name;
        rec.getAllEvents().then(function(tasks) {
            console.log('tasks: '+tasks);
            for (var i = 0; i < tasks.length; i++) {
                if(tasks[i].data.status != 'COMPLETED') {
                    var task = [];
                    tasks[i].project = project;
                    formatResToTask(task, tasks[i]);
                    tasksList.push(task);
                    console.log(i + "taskas title:" + task.title);
                    console.log(i + "taskas entry:" + task.createdAt);
                    console.log(i + "taskas prior:" + task.priority);
                    console.log(i + "taskas due:" + task.due);
                    console.log(i + "taskas proj:" + task.project);
                }
            }
            call(tasksList);
        });
    });
}

function formatResToTask(task, input) {

    task.title = input.data.title;
    task.entry = input.data.createdAt;

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

    if(task.priority == null)
        task.priority = '';
    else if (task.priority == 'H')
        task.priority = 1;
    else if (task.priority == 'M')
        task.priority = 5;
    else
        task.priority = 9;
}

function generateURI() {
    var rand = '';
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 36; i++ )
        rand += possible.charAt(Math.floor(Math.random() * possible.length));
    return rand;
}

module.exports = new Wrapper();