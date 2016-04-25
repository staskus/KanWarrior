function createTask(){
    alert("Uzduotis bus sukurta.");
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