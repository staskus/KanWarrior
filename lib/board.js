var board = function board(id,name,tasks) {
    this.id = id;
    this.name = name;
    this.type = "board";
    this.tasks = tasks;

    if (typeof tasks === "undefined") {
        this.tasks = new Array;
    }

};

module.exports = board;


