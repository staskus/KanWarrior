var taskManager = require("../lib/TaskManager");
var Task = require("../lib/Task");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

module.exports.controller = function (app) {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get('/', function (req, res) {

        if(req.query.projects == null) // For first page load
        {
            req.query.projects = "All";
        }

        taskManager.getAllTasks((taskArray)=> {
            taskManager.update(taskArray);
            var tasks = [];
            var projects = [];

            for (var i = 0; i < taskArray.length; i++) {
                if ((req.query.projects == taskArray[i].project) || (req.query.projects == "All")) { //filter tasks by projects
                    taskArray[i] = attachToBoard(taskArray[i]);
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
                            name: 'Add Name', //board name
                            parent: taskArray[i].parent,
                            //parent: 'board_1',
                            type: 'task'
                        }
                    )

                }

                if((projects.indexOf(taskArray[i].project) <= -1) && !(taskArray[i].project == null )) // make projects array
                {
                    projects.push(taskArray[i].project);
                }

            }
            projects.push("All"); //Artificially create ability to list all projects

            res.render('index.ejs', {tasks: tasks, projects: projects});
        });

    });

    function attachToBoard(task){
        //"board_index" is for frontend visualization
        var inbox = "inbox"; //board_1
        var secondBacklog = "secondBacklog";//board_2
        var firstBacklog = "firstBacklog"; //board_3
        var inProgress = "inProgress"; //board_4
        var done = "done";//board_5

        if(taskManager.tagExists(task, inbox))
            task.parent = "board_1";
        else if(taskManager.tagExists(task, secondBacklog))
            task.parent = "board_2";
        else if(taskManager.tagExists(task, firstBacklog))
            task.parent = "board_3";
        else if(taskManager.tagExists(task, inProgress))
            task.parent = "board_4";
        else if(taskManager.tagExists(task, done))
            task.parent = "board_5";

        return task;
    }


    app.post('/new_task', urlencodedParser, function (req, res) {
        //console.log(req.body.description + " " + req.body.due + " " + req.body.priority + " " + req.body.project + " " + req.body.tags)
        taskManager.addTask(req.body.description, req.body.due, req.body.priority, req.body.project, req.body.tags);
        res.redirect('/');
    });

    app.post('/delete_task', urlencodedParser, function (req, res) {
        //console.log("trying to delete" + req.body.id);
        taskManager.deleteTask(req.body.id);
        res.redirect('/');
    });

    app.post('/edit_task', urlencodedParser, function (req, res) {
        //console.log("editing" + req.body.description + " " + req.body.due + " " + req.body.priority + " " + req.body.project + " " + req.body.tags)
        //console.log("trying to delete" + req.body.id);
        taskManager.editTask(req.body.id, req.body.description, req.body.due, req.body.priority, req.body.project, req.body.tags);
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


