var caldav = require("../lib/scrapegoat/lib/index");

var Wrapper = function() {};

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
        uri: 'https://dav.fruux.com/calendars/a3298237652/300cc743-fd64-4386-a3d2-d88ecf10894e/'
    };

    var rec = new caldav(config);

    rec.getCtag().then(function(info) {
        project = info.name;
        rec.getAllEvents().then(function(tasks) {
            for (var i = 0; i < tasks.length; i++) {
                if(tasks[i].data.status != 'COMPLETED') {
                    var task = [];
                    tasks[i].project = project;
                    formatTask(task, tasks[i]);
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

function formatTask(task, input) {

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

module.exports = new Wrapper();