var exec = require('child_process').exec;
var util = require('util');
var exports = module.exports = {};
var Task = require("../lib/Task");

var firstBacklog = "firstBacklog"; //possible to change to function or regex to make the system more flexible and have more logs
var secondBacklog = "secondBacklog";
var inProgress = "inProgress"; //possible to change to function or regex to make the system more flexible and have more logs
var inbox = "inbox";
var done = "done";

exports.getOutput = function getOutput(input,fn) {

    text = exec(`task ${input}`, function (err, stdout) {

        fn(stdout); //prints stdout to the console

    })
}

var update = exports.update = function update(tasks) {

    for (i=0;i<tasks.length;i++) {
        var t = tasks[i];

        console.log("TAGAI: " + t.id + " " + t.tags + "; ");
        //for (j=0;j<t.tags.length;j++) {
            removeUnneededTags(t); //remove those kw tags that were assigned in taskwarrior and are not needed for kw
        //}

        if (t.status.toLowerCase() == "pending") { //if the current task is pending
            if (tagExists(t, "next")) { //if it has 'next' tag
                if (!isInLogs(t)) { //check if any of the logs tags exist
                    exchangeTag(t, inbox, firstBacklog); //if not, put it in the first backlog (and remove from inbox)
                }
            }
            else { //if no 'next' tag
                if ((!isInLogs(t)) && (t.tags.indexOf(inbox) == -1)) {
                    addTag(t, inbox);// put the task in the inbox
                }
            }
        }
        else if (t.status.toLowerCase() == "completed") { // if the task is completed
            if (!tagExists(t, done)) //if it does not have done tag
                addTag(t, done);//add done tag
        }
    }
}

var f = exports.getAllTasks = function getAllTasks(fn) {

    /* task export, exports all the tasks in the JSON format */
    text = exec(`task export`, function (err, stdout) {

        var jsonObj = JSON.parse(stdout); //parsing JSON
        var taskArray = new Array;
        for (i=0;i<jsonObj.length;i++) {
            var t = jsonObj[i];
            if(t.status.toLowerCase() != "deleted") { // task export contains deleted tasks and we don't need them
                taskArray.push(new Task(t.id, t.uuid, t.description,
                    t.status, t.entry, t.project, t.due, t.urgency, t.priority, t.tags)); //creating array of parsed task objects
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

var exchangeTag = exports.exchangeTag = function exchangeTag(task,originalTag,changedTag) {

    removeTag(task,originalTag);
    addTag(task,changedTag);

};

var removeTag = exports.removeTag = function removeTag(task,tag) {
    if(tagExists(task,tag)) executeCommand(`${task.uuid} modify -${tag}`)
}

var addTag = exports.addTag = function addTag(task,tag) {
   if(!tagExists(task,tag)) executeCommand(`${task.uuid} modify +${tag}`);
}

var tagExists = exports.tagExists = function tagExists(task,tag) {
    if (task.tags.indexOf(tag)!=-1) {
        return true;
    }
    return false;
}

function isInLogs(task) {
    if (tagExists(task,firstBacklog)||tagExists(task,secondBacklog)||tagExists(task,inProgress)||(tagExists(task,done))) {
        return true;
    }
    return false;

}

function removeUnneededTags(task) { //make reverse workflow

    if (tagExists(task,done)) {
        removeTag(task,inProgress);
        removeTag(task,secondBacklog);
        removeTag(task,firstBacklog);
        removeTag(task,inbox);
    }
    if (tagExists(task,inProgress)) {
        removeTag(task,secondBacklog);
        removeTag(task,firstBacklog);
        removeTag(task,inbox);
    }
    if (tagExists(task,secondBacklog)) {
        removeTag(task,firstBacklog);
        removeTag(task,inbox);
    }
    if (tagExists(task,firstBacklog)) {
        removeTag(task,inbox);
    }
}

var addTask = exports.addTask = function addTask(description, due, priority, project, tags){

    var fullTagsString = "";
    var space = " ";
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
    executeCommand(`add ${description} project:${project} due:${due} priority:${priority} ${fullTagsString}`);
}

var editTask = exports.editTask = function editTask(id, description, due, priority, project, tags){

    var fullTagsString = "";
    var space = " ";
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
    console.log(`modify ${id} ${description} project:${project} due:${due} priority:${priority} tags:${fullTagsString}`);

    executeCommand(`modify ${id} ${description} project:${project} due:${due} priority:${priority} tags:${fullTagsString}`);
}

var deleteTask = exports.deleteTask = function deleteTask(id){

    var del = executeCommand(`delete ${id}`);
    del.stdin.write(`yes\n`);
}

var getAllProjectTasks = exports.getAllProjectTasks = function getAllProjects(projectName,fn) { // unused

    text = exec(`Task export project:${projectName}`, function (err, stdout) {

        var jsonObj = JSON.parse(stdout); //parsing JSON
        var taskArray = new Array;
        for (i=0;i<jsonObj.length;i++) {
            var t = jsonObj[i];
            taskArray.push(new Task(t.id,t.uuid,t.description,
                t.status,t.entry,t.project,t.due,t.urgency,t.priority,t.tags)); //creating array of parsed task objects
        }

        fn(taskArray); // callback function, sending back the task array

    })


}

/* example function, which can be used in server.js to visualize tasks:
1. retrieves tasks from taskwarrior
2. does all the necessary updates
3. iterates through all the tasks and prints description
 */
/*
f((tasks)=> {

    update(tasks);

    f((taskArray)=>{
        for (i=0;i<taskArray.length;i++) {
           console.log(`description: ${taskArray[i].description}`);
        }
    })


}); */
