var taskManager = require("../lib/TaskManager");
var Task = require("../lib/Task");
var callDAVWrap = require("../lib/callDAVWrap");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports.controller = function (app) {

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get('/', function (req, res) {

        if (req.query.projects == null) // For first page load
        {
            req.query.projects = "All";
        }
        //console.log(req.query.tags);

        taskManager.getAllTasks((taskArray)=> {
            //for (var i = 0; i < taskArray.length; i++) {
            //    console.log("b4 upd: " + taskArray[i].id + " " + taskArray[i].description + " " + taskArray[i].due);
            //}
            taskManager.update(taskArray);

            //for (var i = 0; i < taskArray.length; i++) {
            //    console.log("after upd: " + taskArray[i].id + " " + taskArray[i].description + " " + taskArray[i].due);
            //}

            var tasks = [];
            var tags = [];
            var projects = [];

            for (var i = 0; i < taskArray.length; i++) {
                if ((req.query.projects == taskArray[i].project) || (req.query.projects == "All")) { //filter tasks by projects
                    if (compareTags(taskArray[i].tags, req.query.tags)) {
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
                                start: taskArray[i].start,
                                name: 'Add Name', //board name
                                parent: taskArray[i].parent,
                                //parent: 'board_1',
                                type: 'task'
                            }
                        )
                    }
                }
                else if (req.query.projects == "-") { //filter tasks with no projects
                    if ((taskArray[i].project == "") || (taskArray[i].project == null) || (taskArray[i].project == undefined)) {
                        if (compareTags(taskArray[i].tags, req.query.tags)) {
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
                                    start: taskArray[i].start,
                                    name: 'Add Name', //board name
                                    parent: taskArray[i].parent,
                                    //parent: 'board_1',
                                    type: 'task'
                                }
                            )
                        }
                    }
                }

                if ((projects.indexOf(taskArray[i].project) <= -1) && !(taskArray[i].project == null )) // make projects array
                {
                    projects.push(taskArray[i].project);
                }

                tags = tags.concat(taskArray[i].tags); //join all arrays of tags into one
                tags = tags.reduce(function (a, b) {      //leave out duplicate tags
                    if ((a.indexOf(b) < 0) && (!isBoardTag(b))) a.push(b);
                    return a;
                }, []);
            }

            projects.push("All"); //Create ability to list tasks from all projects
            projects.push("-"); //Create ability to list all tasks with no projects
            sortTasks(tasks);
            res.render('index.ejs', {tasks: tasks, projects: projects, tags: tags});
        });
    });

    function sortTasks(tasks) {

        for (var i = 0; i < tasks.length; i++) {
            var temp = tasks[i];
            var j = i;

            while (j > 0 && temp.urgency > tasks[j - 1].urgency) {
                tasks[j] = tasks[j - 1];
                j--;
            }
            tasks[j] = temp;
        }
        return tasks;
    }

    function compareTags(taskTags, requestTags) {

        if (requestTags == null) {
            return true;
        } else {
            if (typeof requestTags === 'string' || requestTags instanceof String) {// if checked only 1 tag
                return taskTags.indexOf(requestTags) > -1;
            } else {                                                                // if multiple
                var counter = 0;
                for (var j = 0; j < requestTags.length; j++) {
                    if (taskTags.indexOf(requestTags[j]) > -1) {
                        counter++;
                    }
                }
                return counter == requestTags.length;
            }
        }
    }

    function isBoardTag(tag) {
        if ((tag == "inbox") || (tag == "firstBacklog") || (tag == "secondBacklog") || (tag == "inProgress") || (tag == "done"))
            return true;
        else
            return false;
    }

    function attachToBoard(task) {
        //"board_index" is for frontend visualization
        var inbox = "inbox"; //board_1
        var firstBacklog = "firstBacklog"; //board_2
        var secondBacklog = "secondBacklog";//board_3
        var inProgress = "inProgress"; //board_4
        var done = "done";//board_5

        if (taskManager.tagExists(task, inbox))
            task.parent = "board_1";
        else if (taskManager.tagExists(task, secondBacklog))
            task.parent = "board_3";
        else if (taskManager.tagExists(task, firstBacklog))
            task.parent = "board_2";
        else if (taskManager.tagExists(task, inProgress))
            task.parent = "board_4";
        else if (taskManager.tagExists(task, done))
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
        //console.log("editing: " + req.body.id + " " + req.body.description + " " + req.body.due + " " + req.body.priority + " " + req.body.project + " " + req.body.tags)
        //console.log("trying to delete" + req.body.id);
        taskManager.editTask(req.body.id, req.body.description, req.body.due, req.body.priority, req.body.project, req.body.tags, req.body.status, req.body.start);
        res.redirect('/');
    });

    app.post('/sync', urlencodedParser, function (req, res) {
        console.log("synchronize");
        callDAVWrap.login();
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


