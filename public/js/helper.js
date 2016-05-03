function createTask(){
    alert("Uzduotis bus sukurta.");
}

function deleteTask(id) { // can't make ajax :/


    id = id +1;
    //alert(id);
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

function loadTasks(){
    var data = [];

    var board1 = { id : 'board_1', name : 'Inbox', type: 'board', tasks: [] };
    var board2 = { id : 'board_2', name : 'Second Backlog', type: 'board', tasks: [] };
    var board3 = { id : 'board_3', name : 'First Backlog', type: 'board', tasks: [] };
    var board4 = { id : 'board_4', name : 'In Progress', type: 'board', tasks: [] };
    var board5 = { id : 'board_5', name : 'Done', type: 'board', tasks: [] };

    for (var i = 0; i < tasksList.length; i++) { //assign task to a board
        if(tasksList[i].parent == "board_1")
            board1.tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_2")
            board2.tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_3")
            board3.tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_4")
            board4.tasks.push(tasksList[i]);
        else if (tasksList[i].parent == "board_5")
            board5.tasks.push(tasksList[i]);
    }


    return JSON.stringify([
        board1, board2, board3, board4, board5
        //{ id : 'board_1',
        //name : 'Inbox',
        //type: 'board',
        //tasks: board1tasks
        //}
        //,
        //{ id : 'board_2',
        //name : 'Second Backlog',
        //type: 'board',
        //tasks: board2tasks
        //}
        //,
        //{ id : 'board_3',
        //    name : 'First Backlog',
        //    type: 'board',
        //    tasks: board3tasks
        //}
        //,
        //{ id : 'board_4',
        //    name : 'In Progress',
        //    type: 'board',
        //    tasks: board4tasks
        //}
        //,
        //{ id : 'board_5',
        //    name : 'Done',
        //    type: 'board',
        //    tasks: board5tasks
        //}
    ]);
}

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