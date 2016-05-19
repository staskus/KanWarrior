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
    this.tags = itemData.tags || '';
    this.start = itemData.start || '';

    this.name = itemData.name || '';
    this.type = itemData.type || '';
    this.parent = itemData.parent || '';
    this.parentIndex = this.parent != '' ? (this.parent).match(/\d+/)[0] : '';

    this.template = function() {
      var temp;
      if(this.type == "board") {
        temp = document.getElementById("board_template").innerHTML;
        temp = temp.replace( new RegExp( "::BoardName::", "i" ), (this.name));
      }
      else {
        temp = document.getElementById("task_template").innerHTML;
        if(this.status == "completed") {
            temp =
            `<div class="panel panel-default">
              <div class="panel-heading">
                  <h3 class="panel-title task-title"><b style="float: left">::TaskId::. </b>::TaskDesc::</h3>
              </div>
              <!--<div class="panel-body">-->
                  <!--<div>Urgency: ::TaskUrgency::</div>-->
              <!--</div>-->
              <div class="btn-group task-actions" role="group" aria-label="...">
                  <button class="btn btn-default edit-task" disabled="disabled">Edit</button>
                  <button class="btn btn-default delete-task" disabled="disabled">Delete</button>
              </div>
            </div>`;
        }

        //alert(temp);
        temp = temp.replace( new RegExp( "::block-id::", "g" ), ('block-id:' + this.id));
        temp = temp.replace( new RegExp( "::TaskId::", "g" ), (this.id));
        temp = temp.replace( new RegExp( "::TaskDesc::", "g" ), (this.desc));
        temp = temp.replace( new RegExp( "::TaskStatus::", "g" ), (this.status))
        temp = temp.replace( new RegExp( "::TaskEntry::", "g" ), (this.entry))
        temp = temp.replace( new RegExp( "::TaskProject::", "g" ), (this.project))
        temp = temp.replace( new RegExp( "::TaskDue::", "g" ), (this.due))
        temp = temp.replace( new RegExp( "::TaskUrgency::", "g" ), (this.urgency))
        temp = temp.replace( new RegExp( "::TaskPriority::", "g" ), (this.priority))
        var realTags = removeBoardTag(this.tags);
        temp = temp.replace( new RegExp( "::TaskTags::", "g" ), (realTags))
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

        var tagsStr = self.tags.join(' '); // for display/update purposes

        myArray[myArray.length] = {
          id : self.id,
          desc : self.desc,
          due : self.due,
          status: self.status,
          start: self.start,
          priority : self.priority,
          project : self.project,
          tags : tagsStr,
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
      //el.className = "task";
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
    var element = event.target.parentNode.parentNode.parentNode;
    var taskIndex = element.getAttribute('data-index');
    var boardIndex = element.getAttribute('data-board-index');
    var task = this.list[boardIndex].tasks[taskIndex];
    deleteTask(parseInt(task.id));
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
    //document.getElementById('add_task_project').value = this.list[this.boardIndex].tasks[taskData.taskIndex].project = this.project;
    this.saveData();
  },
  prepareEditPopup : function(index) { // for editing task

    document.getElementById('task-id').value = this.list[index.boardIndex].tasks[index.taskIndex].id;
    document.getElementById('add_task_desc').value = this.list[index.boardIndex].tasks[index.taskIndex].desc; //load fields to form
    document.getElementById('add_task_due_date').value = this.list[index.boardIndex].tasks[index.taskIndex].due;
    document.getElementById('add_task_priority').value = this.list[index.boardIndex].tasks[index.taskIndex].priority;
    document.getElementById('add_task_project').value = this.list[index.boardIndex].tasks[index.taskIndex].project;
    //var realTags = removeBoardTag(this.list[index.boardIndex].tasks[index.taskIndex].tags); //hide taskwarrior tags from editing (incomplete)
    //document.getElementById('add_task_tags').value = realTags.join(' ');
    document.getElementById('add_task_tags').value = this.list[index.boardIndex].tasks[index.taskIndex].tags;

    document.getElementById('task-title').innerHTML = "Edit Task";
    document.getElementById('task-submit').innerHTML = "Edit Task";
    document.getElementById('add_task_form').action = "/edit_task";

    document.getElementById('edit_task').value = "true";
    document.getElementById('edit_task_index').value = index.taskIndex;
    document.getElementById('parent_board').value = 'board_' + (parseInt(index.boardIndex) + 1);
  },
  openBoardForm : function() {
    document.getElementsByClassName('overlay')[0].className = "overlay open";
    document.getElementsByClassName('add-board-form-title')[0].className = "add-board-form-title active";
    document.getElementById('add_board_form').className = "active";
  },
  openTaskForm : function(event, index) { // for adding task
    var source = event.target;

    document.getElementById('add_task_desc').value = ""; //clear fields
    document.getElementById('add_task_due_date').value = "";
    document.getElementById('add_task_priority').value = "";
    document.getElementById('add_task_project').value = "";
    document.getElementById('add_task_tags').value = "";

    document.getElementById('task-title').innerHTML = "Add Task";
    document.getElementById('task-submit').innerHTML = "Add Task";
    document.getElementById('add_task_form').action = "/new_task";

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
    //if(window.localStorage) {
    //  window.localStorage.myData = JSON.stringify(this.list);
    //}
  },
  addDragData : function(dragData, parentIndex) {
    myArray = MyApp.list[parentIndex-1].tasks;
    myArray[myArray.length] = {
      //name : dragData[0].name,
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
    var newBoardIndex = (ev.target.parentNode.parentNode.parentNode.id).match(/\d+/)[0]; // as much parent nodes as deep from script the item is
    var deleteTaskIndex = item.getAttribute('data-index');
    var deleteBoardIndex = item.getAttribute('data-board-index');
    var task = this.list[deleteBoardIndex].tasks[deleteTaskIndex];
    var taskTags = task.tags;

    taskTags += " " + defineNewTag(newBoardIndex);
    taskTags = taskTags.replace(defineOldTag(deleteBoardIndex),'');
    taskTags = taskTags.replace("  ", " ");
    task.tags = taskTags;

    if (defineOldTag(deleteBoardIndex) == "inProgress") // special mark to stop active task
        task.start = 'dragStop';
    else if  (taskTags.indexOf("inProgress") != -1)
        task.start = 'dragStart';

    //*** some kind of bug with due date, no idea why so here is a "fix"
    if (task.due!="") {
        var res = task.due.substring(9, 10);
        var newDue = task.due.substring(0, 9);
        newDue = newDue.concat((parseInt(res) + 1).toString());
        task.due = newDue;
    }

    editTask(task);
  },
  init : function () {

    var i, j, board, task, myData =  JSON.parse(loadTasks());
    for(i in myData) {
      board = myData[i];
      this.addItem(board);
      for(j in board.tasks) {
        task = board.tasks[j];
        this.addItem(task);
      }
    }
  }
}



window.onload = function () {
  MyApp.init();

  //document.getElementById('add_new_board').addEventListener('click', MyApp.openBoardForm);

  document.addEventListener('click', function(e) {
    var button = e.target;
    if(button.classList.contains("add-task")) {
      MyApp.openTaskForm(e);
    }
    if(button.classList.contains("delete-task")) {
      if (confirm('Are you sure ?'))
      {
        //alert(e);
        MyApp.deleteItem(e);
        }
    }
    if(button.classList.contains("edit-task")) {
      var index ={
        taskIndex : button.parentNode.parentNode.parentNode.getAttribute('data-index'),
        boardIndex : button.parentNode.parentNode.parentNode.getAttribute('data-board-index')
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

  //document.getElementById('add_task_form').addEventListener('submit', function(event) {
  //  event.preventDefault();
  //  var taskData = {
  //      id : document.getElementById('add_task_id').value,
  //    name : document.getElementById('add_task_name').value,
  //    desc : document.getElementById('add_task_desc').value,
  //    parent : document.getElementById('parent_board').value,
  //    taskIndex : document.getElementById('edit_task_index').value,
  //    type : "task" }
  //  if(document.getElementById('edit_task').value == "true") {
  //    MyApp.editItem(taskData);
  //  }
  //  else {
  //    MyApp.addItem(taskData);
  //  }
  //
  //
  //  document.getElementById('add_task_id').value = "";
  //  document.getElementById('add_task_name').value = "";
  //  document.getElementById('add_task_desc').value = "";
  //  document.getElementById('parent_board').value = "";
  //  document.getElementById('edit_task').value = "false";
  //  document.getElementById('edit_task_index').value = "";
  //  MyApp.closePopup();
  //});
}
