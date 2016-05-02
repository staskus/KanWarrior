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
    return JSON.stringify([{ id : 'board_1',
        name : 'Name this Board',
        type: 'board',
        tasks: tasksList
    }]);
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