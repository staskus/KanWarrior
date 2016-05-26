KanWarrior
========
Visual [Taskwarrior] extension which combines personal management and agile project management qualities.

###  Features:
- Full synchronization between Taskwarrior and GUI: create, edit and delete tasks.
- Visual representation of tasks and their states using Kanban boards.
- Drag and drop between boards
- Toggle full and partial display mode of the task by click
- Filtering by projects and tags
- Ability to synchronize tasks with online services using CalDAV protocol.

### Usage:

In KanWarrior's directory use `npm update` then `node main.js` and navigate to `http://localhost:8081/` on the browser.

### Requirements:

*MUST* have Taskwarrior installed in order to use any of the provided functionality.

###  External resources:

- Extended and tweaked [scrapegoat] library for CalDAV support.
- Modified [task-management] GUI  


*


Note: project has plenty of room for improvement and upgrades.


[scrapegoat]:https://github.com/peerigon/scrapegoat
[Taskwarrior]:http://taskwarrior.org/
[task-management]:https://github.com/eramishra/task-management