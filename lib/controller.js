var taskManager = require("../lib/TaskManager");
var Task = require("../lib/Task");

module.exports.controller = function (app) {

    app.get('/', function (req, res) {

        taskManager.getAllTasks((taskArray)=> {

            var tasks = [];

            for (var i = 0; i < taskArray.length; i++) {
                tasks.push(
                    {
                        id: i,
                        desc: taskArray[i].description,
                        name: 'Add Name',
                        parent: 'board_1',
                        type: 'task'
                    }
                )
            }
            res.render('index.ejs', {tasks: tasks});
        });

    })

}


