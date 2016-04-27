var taskManager = require("../lib/TaskManager");
var Task = require("../lib/Task");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports.controller = function (app) {

    app.get('/', function (req, res) {

        if(req.query.projects == null) // For first page load
        {
            req.query.projects = "All";
        }

        taskManager.getAllTasks((taskArray)=> {
            var tasks = [];
            var projects = [];

            for (var i = 0; i < taskArray.length; i++) {
                if ((req.query.projects == taskArray[i].project) ||(req.query.projects == "All")) {
                    tasks.push(
                        {
                            id: i + 1,
                            desc: taskArray[i].description,
                            status: taskArray[i].status,
                            entry: taskArray[i].entry,
                            project: taskArray[i].project,
                            due: taskArray[i].due,// ?
                            urgency: taskArray[i].urgency,
                            priority: taskArray[i].priority,// ?
                            tags: taskArray[i].tags,
                            name: 'Add Name',
                            parent: 'board_1',
                            type: 'task'
                        }
                    )
                }

                if((projects.indexOf(taskArray[i].project) <= -1) && !(taskArray[i].project == null ))
                {
                    projects.push(taskArray[i].project);
                }

            }
            projects.push("All"); //Artificially create ability to list all projects

            res.render('index.ejs', {tasks: tasks, projects: projects});
        });

    });

    app.post('/new_task', urlencodedParser, function (req, res) {
        //console.log(req.body.description + " " + req.body.due + " " + req.body.priority + " " + req.body.project + " " + req.body.tags)
        taskManager.addTask(req.body.description, req.body.due, req.body.priority, req.body.project, req.body.tags);
        res.redirect('/');
    });

    //app.post('/', urlencodedParser, function (req, res) { // join with get
    //
    //    taskManager.getAllTasks((taskArray)=> {
    //        var tasks = [];
    //        var projects = [];
    //
    //        for (var i = 0; i < taskArray.length; i++) {
    //            if ((req.body.projects == taskArray[i].project) ||(req.body.projects == "All")) {
    //                tasks.push(
    //                    {
    //                        id: i + 1,
    //                        desc: taskArray[i].description,
    //                        status: taskArray[i].status,
    //                        entry: taskArray[i].entry,
    //                        project: taskArray[i].project,
    //                        due: taskArray[i].due,// ?
    //                        urgency: taskArray[i].urgency,
    //                        priority: taskArray[i].priority,// ?
    //                        tags: taskArray[i].tags,
    //                        name: 'Add Name',
    //                        parent: 'board_1',
    //                        type: 'task'
    //                    }
    //                )
    //            }
    //
    //            if ((projects.indexOf(taskArray[i].project) <= -1) && !(taskArray[i].project == null )) {
    //                projects.push(taskArray[i].project);
    //            }
    //
    //        }
    //        projects.push("All"); //Artificially create ability to list all projects
    //
    //        res.render('index.ejs', {tasks: tasks, projects: projects});
    //    });
    //
    //})

};


