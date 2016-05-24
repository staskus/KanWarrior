var exec = require('child_process').exec;
var util = require('util');
var exports = module.exports = {};
var Task = require("../models/Task");

var firstBacklog = "firstBacklog"; //possible to change to function or regex to make the system more flexible and have more logs
var secondBacklog = "secondBacklog";
var inProgress = "inProgress"; //possible to change to function or regex to make the system more flexible and have more logs
var inbox = "inbox";
var done = "done";

exports.getOutput = function getOutput(input, fn) {

    text = exec(`task ${input}`, function (err, stdout) {

        fn(stdout); //prints stdout to the console

    })
}

var update = exports.update = function update(tasks, callback) {

    for (i = 0; i < tasks.length; i++) {
        var t = tasks[i];

        removeUnneededTags(t); // remove those kw tags that were assigned in taskwarrior and are not needed for kw
        prepareStartTask(t); // check if task is started and adjust tags if is needed

        if (t.status.toLowerCase() == "pending") { //if the current task is pending

            if (tagExists(t, "done")) {
                t.status = "completed";
            } else {

                if (tagExists(t, "next")) { //if it has 'next' tag
                    if (!isInLogs(t)) { //check if any of the logs tags exist
                        exchangeTag(t, inbox, firstBacklog); //if not, put it in the first backlog (and remove from inbox)
                    }
                }
                else {
                    if ((!isInLogs(t)) && (t.tags.indexOf(inbox) == -1)) {
                        addTag(t, inbox);// put the task in the inbox
                    }
                }
            }
        }
        else if (t.status.toLowerCase() == "completed") { // if the task is completed
            if (!tagExists(t, done))
                addTag(t, done);
        }
    }
}

var f = exports.getAllTasks = function getAllTasks(fn) {

    /* task export, exports all the tasks in the JSON format */
    text = exec(`task export`, function (err, stdout) {

        var jsonObj = JSON.parse(stdout); //parsing JSON
        var taskArray = new Array;
        for (i = 0; i < jsonObj.length; i++) {
            var t = jsonObj[i];
            if (t.status.toLowerCase() != "deleted") { // task export contains deleted tasks and we don't need them
                taskArray.push(new Task(t.id, t.uuid, t.description,
                    t.status, t.entry, t.project, t.due, t.urgency, t.priority, t.tags, t.start)); //creating array of parsed task objects
            }
        }

        fn(taskArray); // callback function, sending back the task array

    })
}

var executeCommand = exports.executeCommand = function executeCommand(input) {

    var process = exec(`task ${input}`, function (err, stdout) {
        if (err) {
            console.log(`Command "task ${input}" failed with message:  ${err.message}`)
        }
        else
            console.log(`Command "task ${input}" executed successfully`)
    })

    return process; //return the child process
};

var exchangeTag = exports.exchangeTag = function exchangeTag(task, originalTag, changedTag) {

    removeTag(task, originalTag);
    addTag(task, changedTag);

};

var removeTag = exports.removeTag = function removeTag(task, tag) {
    if (tagExists(task, tag)) executeCommand(`${task.uuid} modify -${tag}`)
}

var addTag = exports.addTag = function addTag(task, tag) {
    if (!tagExists(task, tag)) executeCommand(`${task.uuid} modify +${tag}`);
}

var tagExists = exports.tagExists = function tagExists(task, tag) {
    if (task.tags.indexOf(tag) != -1) {
        return true;
    }
    return false;
}

function isInLogs(task) {
    if (tagExists(task, firstBacklog) || tagExists(task, secondBacklog) || tagExists(task, inProgress) || (tagExists(task, done))) {
        return true;
    }
    return false;

}

function removeUnneededTags(task) {

    if (tagExists(task, done)) {
        if (tagExists(task, inProgress))
            removeTag(task, inProgress);
        if (tagExists(task, secondBacklog))
            removeTag(task, secondBacklog);
        if (tagExists(task, firstBacklog))
            removeTag(task, firstBacklog);
        if (tagExists(task, inbox))
            removeTag(task, inbox);
    }
    if (tagExists(task, inProgress)) {
        if (tagExists(task, secondBacklog))
            removeTag(task, secondBacklog);
        if (tagExists(task, firstBacklog))
            removeTag(task, firstBacklog);
        if (tagExists(task, inbox))
            removeTag(task, inbox);
    }
    if (tagExists(task, secondBacklog)) {
        if (tagExists(task, inProgress))
            removeTag(task, inProgress);
        if (tagExists(task, firstBacklog))
            removeTag(task, firstBacklog);
        if (tagExists(task, inbox))
            removeTag(task, inbox);
    }
    if (tagExists(task, firstBacklog)) {
        if (tagExists(task, secondBacklog))
            removeTag(task, secondBacklog);
        if (tagExists(task, inProgress))
            removeTag(task, inProgress);
        if (tagExists(task, inbox))
            removeTag(task, inbox);
    }
}

function prepareStartTask(task) {
    if (!tagExists(task, inProgress) && task.start != null) { // if task is started, add "in progress" tag
        addTag(task, inProgress);
    }
    else if (tagExists(task, inProgress) && task.start == null) { // if "in progress" tag, start the task
        exchangeTag(task, inProgress, inbox);
    }
}


var addTask = exports.addTask = function addTask(description, due, priority, project, tags, entry) {

    var fullTagsString = "";
    tags = tags.split(" ");

    if (tags != null && tags != '') {
        if (typeof tags == 'string') {
            fullTagsString = "+" + tags;
        } else {
            for (i = 0; i < tags.length; i++) { //concat tags string
                var s = "+" + tags[i] + " ";
                fullTagsString = fullTagsString + s;
            }
        }
    }
    if(entry == null)
        entry = '';

    executeCommand(`add ${description} project:'${project}' due:${due} entry:${entry} priority:${priority} ${fullTagsString}`);
}

var editTask = exports.editTask = function editTask(id, description, due, priority, project, tags, status, start) {

    var fullTagsString = "";
    tags = tags.split(" ");

    if (tags != null && tags != '') {
        if (typeof tags == 'string') {
            fullTagsString = tags;
        } else {
            fullTagsString = tags[0] + " ";
            for (i = 1; i < tags.length; i++) { //concat tags string
                var s = "+" + tags[i] + " ";
                fullTagsString = fullTagsString + s;
            }
        }
    }
    if (typeof tags == 'string' && tags == 'done' || (tags.indexOf(done) != -1)) // change status according to tag
        status = "completed";
    else
        status = "pending";

    startTask(id, tags, start);
    stopTask(id, tags, start);

    executeCommand(`modify ${id} '${description}' project:'${project}' due:${due} priority:${priority} tags:${fullTagsString} status:${status}`);
}

var startTask = exports.startTask = function startTask(id, tags, start) {
    if ((tags.indexOf(inProgress) != -1) && start == 'dragStart') { // if "in progress" tag, start the task
        executeCommand(`${id} start`);
    }
}

var stopTask = exports.stopTask = function stopTask(id, tags, start) {
    if ((tags.indexOf(inProgress) == -1) && start == 'dragStop') { //if task is no longer inProgress - stop it
        executeCommand(`${id} stop`);
    }
}

var deleteTask = exports.deleteTask = function deleteTask(uuid) {

    var del = executeCommand(`delete ${uuid}`);
    del.stdin.write(`yes\n`);
}

var getAllProjectTasks = exports.getAllProjectTasks = function getAllProjects(projectName, fn) {

    text = exec(`task export project:'${projectName}'`, function (err, stdout) {
        var jsonObj = JSON.parse(stdout); //parsing JSON
        var taskArray = [];
        for (i = 0; i < jsonObj.length; i++) {
            var t = jsonObj[i];
            if (t.status.toLowerCase() != "deleted") {
                taskArray.push(new Task(t.id, t.uuid, t.description,
                t.status, t.entry, t.project, t.due, t.urgency, t.priority, t.tags, t.start)); //creating array of parsed task objects
            }
        }

        fn(taskArray); // callback function, sending back the task array

    })
}
