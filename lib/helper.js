var taskManager = require("../lib/taskManager");
var exports = module.exports = {};

exports.sortTasks = function sortTasks(tasks) {

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

exports.compareTags = function compareTags(taskTags, requestTags) {

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

exports.isBoardTag = function isBoardTag(tag) {
    if ((tag == "inbox") || (tag == "firstBacklog") || (tag == "secondBacklog") || (tag == "inProgress") || (tag == "done"))
        return true;
    else
        return false;
}

exports.attachToBoard = function attachToBoard(task) {
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