var MyApp = {
  list : [],
  CreateItem : function(itemData) {
    var self = this;
    this.id = itemData.id || '';
    this.desc = itemData.desc || '';
    this.status = itemData.status || '';
    this.entry = itemData.entry || '';
    this.project = itemData.project || '';
    this.due = itemData.due || '';
    this.urgency = itemData.urgency || '';
    this.priority = itemData.priority || '';
    //this.tags = itemData.tags || '';

    this.name = itemData.name || '';
    this.type = itemData.type || '';
    this.parent = itemData.parent || '';
    this.parentIndex = this.parent != '' ? (this.parent).match(/\d+/)[0] : '';

    this.template = function() {
      var temp;
      if(this.type == "board") {
        temp = document.getElementById("board_template").innerHTML
        temp = temp.replace( new RegExp( "::BoardName::", "i" ), (this.name))
      }
      else {
        temp = document.getElementById("task_template").innerHTML
        temp = temp.replace( new RegExp( "::TaskId::", "i" ), (this.id))
        temp = temp.replace( new RegExp( "::TaskDesc::", "i" ), (this.desc))
        temp = temp.replace( new RegExp( "::TaskStatus::", "i" ), (this.status))
        temp = temp.replace( new RegExp( "::TaskEntry::", "i" ), (this.entry))
        temp = temp.replace( new RegExp( "::TaskProject::", "i" ), (this.project))
        temp = temp.replace( new RegExp( "::TaskDue::", "i" ), (this.due))
        temp = temp.replace( new RegExp( "::TaskUrgency::", "i" ), (this.urgency))
        temp = temp.replace( new RegExp( "::TaskPriority::", "i" ), (this.priority))
      }
      return temp;
    };
    this.addToList = function() {
      var myArray;
      if(self.type == "board"){
        myArray = MyApp.list;
        myArray[myArray.length] = {
          name : itemData.name,
          id : 'board_' + (parseInt(MyApp.list.length) + 1),
          type: 'board',
          tasks : []
        }
      }else{
        myArray = MyApp.list[self.parentIndex-1].tasks;
        myArray[myArray.length] = {
          name : self.name,
          desc : self.desc,
          type : 'task',
          parent : 'board_' + self.parentIndex
        }
      }
    };
  },
  addItem : function(itemData) {
    var myItem = new this.CreateItem(itemData);
    if(myItem.type == 'board') {
      var el = document.createElement('div');
      el.className = "board-wrap";
      el.setAttribute('id', 'board_' + (parseInt(this.list.length) + 1));
      el.innerHTML = myItem.template();
      document.getElementById("boards_container").appendChild(el);
    }
    else {
      var el = document.createElement('li');
      el.className = "task";
      el.setAttribute('data-index',  (this.list[myItem.parentIndex -1].tasks.length));// ???wtf is this
      el.setAttribute('data-board-index',  myItem.parentIndex - 1);                   //  ??and this
      el.setAttribute('draggable',  'true');
      el.setAttribute('ondragstart',  'MyApp.drag(event)');
      el.innerHTML = myItem.template();
      document.getElementById(myItem.parent).getElementsByClassName('task-items')[0].appendChild(el);
    }
    myItem.addToList();
    this.saveData();
  },
  deleteItem : function(event) {
    var element = event.target.parentNode.parentNode;
    var taskIndex = element.getAttribute('data-index');
    var boardIndex = element.getAttribute('data-board-index');
    element.remove();
    MyApp.list[boardIndex].tasks.splice(taskIndex, 1);
    this.saveData();
  },
  editItem : function(taskData) {
    this.name = taskData.name;
    this.desc = taskData.desc;
    this.boardIndex = (taskData.parent).match(/\d+/)[0] -1;
    var element = document.getElementById(taskData.parent).getElementsByClassName('task-items')[0].getElementsByClassName('task')[taskData.taskIndex];
    element.getElementsByTagName('h4')[0].innerHTML = this.list[this.boardIndex].tasks[taskData.taskIndex].name = this.name;
    element.getElementsByTagName('p')[0].innerHTML = this.list[this.boardIndex].tasks[taskData.taskIndex].desc = this.desc;
    this.saveData();
  },
  prepareEditPopup : function(index) {
    document.getElementById('add_task_name').value = this.list[index.boardIndex].tasks[index.taskIndex].name;
    document.getElementById('add_task_desc').value = this.list[index.boardIndex].tasks[index.taskIndex].desc;
    document.getElementById('edit_task').value = "true";
    document.getElementById('edit_task_index').value = index.taskIndex;
    document.getElementById('parent_board').value = 'board_' + (parseInt(index.boardIndex) + 1);
  },
  openBoardForm : function() {
    document.getElementsByClassName('overlay')[0].className = "overlay open";
    document.getElementsByClassName('add-board-form-title')[0].className = "add-board-form-title active";
    document.getElementById('add_board_form').className = "active";
  },
  openTaskForm : function(event, index) {
    var source = event.target;
    document.getElementById('parent_board').value = source.parentNode.id;
    document.getElementsByClassName('overlay')[0].className = "overlay open";
    document.getElementsByClassName('add-task-form-title')[0].className = "add-task-form-title active";
    document.getElementById('add_task_form').className = "active";
    if(index != undefined) {
      this.prepareEditPopup(index);
    }
  },
  closePopup : function() {
    document.getElementsByClassName('overlay')[0].className = "overlay";
    document.getElementsByClassName('add-board-form-title')[0].className = "add-board-form-title inactive";
    document.getElementsByClassName('add-task-form-title')[0].className = "add-task-form-title inactive";
    document.getElementById('add_board_form').className = "inactive";
    document.getElementById('add_task_form').className = "inactive";
  },
  saveData : function() {
    if(window.localStorage) {
      window.localStorage.myData = JSON.stringify(this.list);
    }
  },
  addDragData : function(dragData, parentIndex) {
    myArray = MyApp.list[parentIndex-1].tasks;
    myArray[myArray.length] = {
      name : dragData[0].name,
      desc : dragData[0].desc,
      type : 'task',
      parent : 'board_' + parentIndex
    }
  },
  allowDrop : function (ev) {
    ev.preventDefault();
  },
  drag : function(ev) {
    item = ev.target;
    ev.dataTransfer.setData("text", '');
  },
  drop : function(ev) {
    ev.preventDefault();
    ev.target.appendChild(item);
    var newBoardIndex = (ev.target.parentNode.id).match(/\d+/)[0];
    var deleteTaskIndex = item.getAttribute('data-index');
    var deleteBoardIndex = item.getAttribute('data-board-index');
    dragData = this.list[deleteBoardIndex].tasks.slice(deleteTaskIndex, deleteTaskIndex + 1)
    this.list[deleteBoardIndex].tasks.splice(deleteTaskIndex, 1);
    this.addDragData(dragData, newBoardIndex);
    this.saveData();
  },
  init : function () {

    localStorage.myData =  loadTasks();// from TaskWarrior

    var i, j, board, task, myData = JSON.parse(localStorage.myData);
    for(i in myData) {
      board = myData[i];
      this.addItem(board);
      for(j in board.tasks) {
        var task = board.tasks[j];
        this.addItem(task);
      }
    }
  }
}



window.onload = function () {
  MyApp.init();

  document.getElementById('add_new_board').addEventListener('click', MyApp.openBoardForm);

  document.addEventListener('click', function(e) {
    var button = e.target;
    if(button.classList.contains("add-task")) {
      MyApp.openTaskForm(e);
    }
    if(button.classList.contains("delete-task")) {
      MyApp.deleteItem(e);
    }
    if(button.classList.contains("edit-task")) {
      var index ={
        taskIndex : button.parentNode.parentNode.getAttribute('data-index'),
        boardIndex : button.parentNode.parentNode.getAttribute('data-board-index')
      }
      MyApp.openTaskForm(e, index);
    }
  });
  document.getElementById('close_popup').addEventListener('click', MyApp.closePopup);

  document.getElementById('add_board_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var boardData = {
      name : document.getElementById('add_board_name').value,
      type :"board" }
    document.getElementById('add_board_name').value = "";
    MyApp.addItem(boardData)
    MyApp.closePopup();
  });

  document.getElementById('add_task_form').addEventListener('submit', function(event) {
    event.preventDefault();
    var taskData = {
        id : document.getElementById('add_task_id').value,
      name : document.getElementById('add_task_name').value,
      desc : document.getElementById('add_task_desc').value,
      parent : document.getElementById('parent_board').value,
      taskIndex : document.getElementById('edit_task_index').value,
      type : "task" }
    if(document.getElementById('edit_task').value == "true") {
      MyApp.editItem(taskData);
    }
    else {
      MyApp.addItem(taskData);
    }


    document.getElementById('add_task_id').value = "";
    document.getElementById('add_task_name').value = "";
    document.getElementById('add_task_desc').value = "";
    document.getElementById('parent_board').value = "";
    document.getElementById('edit_task').value = "false";
    document.getElementById('edit_task_index').value = "";
    MyApp.closePopup();
  });
}
