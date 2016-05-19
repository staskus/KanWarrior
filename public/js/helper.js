function createTask(){
    alert("Uzduotis bus sukurta.");
}

function editTask(task) {
    post('/edit_task', {id: task.id, description: task.desc, due: task.due, priority: task.priority, project: task.project, tags: task.tags,  status: task.status, start: task.start});
}

function deleteTask(id) { // can't make ajax :/
    post('/delete_task', {id: id});
    //
    //$.ajax({
    //    url: '/new_task',
    //    type: 'POST',
    //    data: { description: "ajax"},
    //    success: function(data){
    //        alert('Success!')
    //    }
    //    , error: function(jqXHR, textStatus, err){
    //        alert('text status '+textStatus+', err '+err)
    //    }
    //})

//$.ajax({
        //    url: '/delete_task',
        //    type: 'DELETE'
        //}).done(function(res){
        //    alert("Task is deleted.");
        //});

    //if (confirm('Patvirtinkite')) {
    //    $.ajax({
    //        //data: {
    //        //    _method: 'delete',
    //        //    id: id
    //        //},
    //        //url: '/delete_task',
    //        //type: 'POST'
    //        cache: false,
    //        url: "/delete_task",
    //        type: "DELETE",
    //        data: id,
    //        success: function (html) {
    //            alert("Task is deleted.");
    //        },
    //        error: function (error) {
    //            alert("Task is not deleted.");
    //            //**alert('error; ' + eval(error));**
    //        }
    //    //}).done(function (res) {
    //    //    alert("Task is deleted.");
    //    //}).fail(function (jqXHR, textStatus, errorThrown) {
    //    //    alert("Task is not deleted.");
    //    //    console.log(textStatus, errorThrown);
    //    })
    //}
}

function returnBoards() {

    var board1 = { id : 'board_1', name : 'Inbox', type: 'board', tasks: [], tag: "inbox"};
    var board2 = { id : 'board_2', name : 'First Backlog', type: 'board', tasks: [], tag: "firstBacklog" };
    var board3 = { id : 'board_3', name : 'Second Backlog', type: 'board', tasks: [], tag: "secondBacklog"};
    var board4 = { id : 'board_4', name : 'In Progress', type: 'board', tasks: [], tag: "inProgress" };
    var board5 = { id : 'board_5', name : 'Done', type: 'board', tasks: [], tag: "done" };

    return [board1, board2, board3, board4, board5];
}

function loadTasks(){

    var boards = returnBoards();

    for (var i = 0; i < tasksList.length; i++) { //assign task to a board

        tasksList[i].entry = formatDate(tasksList[i].entry);
        if(tasksList[i].due != null)
            tasksList[i].due = formatDate(tasksList[i].due);

        if(tasksList[i].parent == "board_1")
            boards[0].tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_2")
            boards[1].tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_3")
            boards[2].tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_4")
            boards[3].tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_5")
            boards[4].tasks.push(tasksList[i]);
    }

    return JSON.stringify([
        boards[0], boards[1],boards[2],boards[3],boards[4]
    ]);
}

function defineNewTag(boardIndex) { // select correct board and choose correct tag for task
    var boards = returnBoards();
    var newTag;

    for (var i = 0; i < boards.length; i++) {
        if (boards[i].id.indexOf(boardIndex.toString()) != -1)
            newTag = boards[i].tag;
    }
    return newTag;
}

function defineOldTag(ind) { // for visual purposes remove old tag
    var boards = returnBoards();
    var oldTag;
    var boardIndex = parseInt(ind) + parseInt(1);

    for (var i = 0; i < boards.length; i++) {
        if (boards[i].id.indexOf(boardIndex.toString()) != -1)
            oldTag = boards[i].tag;
    }
    return oldTag;
}

//function changeStatus(task, status, newStatus) {
//    if(task.status == status){
//        task.status = newStatus;
//    }
//    return task;
//}


function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = yyyy+mm+dd;
    return formatDate(today);
}

function formatDate(str) { // make date format: YYYY-MM-DD
    var date;
    date = str.substring(0,8);
    date = date.insert(4, "-");
    date = date.insert(7, "-");
    return date;
}

function removeBoardTag(tags) { // remove tag which is used to track the board (visual purpose only)
    if(typeof tags == 'string')
        tags = tags.split(" ");
    var newTags = [];
    for (var i = 0; i < tags.length; i++) {
        if (!((tags[i] == "inbox") || (tags[i] == "firstBacklog") || (tags[i] == "secondBacklog") || (tags[i] == "inProgress") || (tags[i] == "done"))) {
            newTags.push(tags[i]);
        }

    }
    return newTags;
}

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

function hide() {
    document.getElementById("calDAV").classList.add('hidden');
    calendars = null;
}

function toggleExtraInfo(id) {

    id = id.substring(9, id.length);

    //alert(id);
    var div = document.getElementsByClassName('extra-info block-id:' + id);
    var div2 = document.getElementsByClassName('panel-body block-id:' + id);

    if (div[0].style.display !== 'none') {
        div[0].style.display = 'none';
        div2[0].style.display = 'block';
    }
    else {
        div[0].style.display = 'block';
        div2[0].style.display = 'none';
    }
}
