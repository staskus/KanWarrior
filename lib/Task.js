var Task = function Task(id,uuid,description,status,entry,project,due,urgency,priority,tags,start) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.entry = entry;
    this.project = project;
    this.due = due;
    this.urgency = urgency;
    this.priority = priority;
    this.uuid = uuid;
    this.tags = tags;
    this.start = start;

    if (typeof tags === "undefined") {
        this.tags = [];
    }

};

module.exports = Task;


