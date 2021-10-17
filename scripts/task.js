"use strict";
var Task = /** @class */ (function () {
    function Task(task) {
        this.destructor = function () { };
        this.text = task.text;
        this.id = task.id;
        this.done = task.done || false;
        this.markedForNextDay = task.markedForNextDay || false;
    }
    return Task;
}());
var TaskManager = /** @class */ (function () {
    function TaskManager(updateCallback) {
        var _this = this;
        this.tasks = [];
        this.currentId = NaN;
        this.taskList = null;
        this.ctrlPressed = false;
        this.loadState();
        this.updateCallback = updateCallback;
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Control')
                _this.ctrlPressed = true;
        });
        document.addEventListener('keyup', function (e) {
            if (e.key === 'Control')
                _this.ctrlPressed = false;
        });
    }
    Object.defineProperty(TaskManager.prototype, "state", {
        get: function () {
            return this.totalTasks === 0
                ? 'NoTasks' : this.todoTasks === 0
                ? 'AllDone' : 'SomeTasks';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskManager.prototype, "todoTasks", {
        get: function () {
            return this.tasks.filter(function (task) { return !task.done; }).length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskManager.prototype, "totalTasks", {
        get: function () {
            return this.tasks.length;
        },
        enumerable: false,
        configurable: true
    });
    TaskManager.prototype.loadOntoPage = function () {
        this.taskList = document.querySelector('.task-container');
        for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            this.createTaskCard(task);
        }
        this.updateCallback(this.tasks);
    };
    TaskManager.prototype.removeFromPage = function () {
        for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            task.destructor();
        }
        this.updateCallback(this.tasks);
    };
    TaskManager.prototype.addTask = function (text) {
        this.addRawTask({ id: this.currentId++, text: text });
    };
    TaskManager.prototype.addRawTask = function (rawTask) {
        var task = new Task(rawTask);
        this.tasks.push(task);
        this.saveState();
        this.createTaskCard(task);
        this.updateCallback(this.tasks);
    };
    TaskManager.prototype.nextDay = function () {
        var _this = this;
        var newTasks = this.tasks
            .filter(function (task) { return task.markedForNextDay; })
            .map(function (task) {
            task.markedForNextDay = false;
            return task;
        })
            .map(function (task) { return task; });
        this.tasks.forEach(function (task) { return task.destructor(); });
        this.tasks = [];
        newTasks.forEach(function (task) { return _this.addRawTask(task); });
    };
    TaskManager.prototype.loadState = function () {
        var state = getStoredStateOrDefault({ tasks: [], currentId: 0 });
        this.tasks = state.tasks.map(function (task) { return new Task(task); });
        this.currentId = state.currentId;
    };
    TaskManager.prototype.saveState = function () {
        saveState({ tasks: this.tasks.map(function (task) { return task; }), currentId: this.currentId });
    };
    TaskManager.prototype.createTaskCard = function (task) {
        var _this = this;
        var _a;
        var deleteButton = createDiv(["delete-button"], svgCross, true);
        var checkbox = createDiv(['checkbox'], svgOk, true);
        var textBox = createDiv(['text'], task.text);
        var taskCard = createDiv(['task'], [checkbox, textBox, deleteButton]);
        taskCard.setAttribute("data-id", task.id.toString());
        var nextDayUpdater = function () {
            if (!_this.ctrlPressed)
                return;
            if (task.markedForNextDay) {
                taskCard.classList.remove("next-day");
                _this.nextDayCallback(task.id, false);
            }
            else {
                taskCard.classList.add("next-day");
                _this.nextDayCallback(task.id, true);
            }
        };
        taskCard.addEventListener('click', nextDayUpdater);
        var checkboxUpdater = function () {
            if (task.done) {
                checkbox.classList.add("checked");
                textBox.classList.add("strike");
            }
            else {
                checkbox.classList.remove("checked");
                textBox.classList.remove("strike");
            }
        };
        checkbox.addEventListener('click', function () {
            _this.checkboxClick(task.id, !task.done);
            checkboxUpdater();
        });
        checkboxUpdater();
        task.destructor = function () {
            taskCard.remove();
            deleteButton.removeEventListener('click', task.destructor);
        };
        deleteButton.addEventListener('click', function () {
            _this.deleteTask(task.id);
            task.destructor();
        });
        (_a = this.taskList) === null || _a === void 0 ? void 0 : _a.insertBefore(taskCard, this.taskList.children[this.taskList.children.length - 1]);
    };
    TaskManager.prototype.deleteTask = function (id) {
        this.tasks = this.tasks.filter(function (element) { return element.id !== id; });
        this.saveState();
        this.updateCallback(this.tasks);
    };
    TaskManager.prototype.checkboxClick = function (id, newState) {
        var task = this.tasks.filter(function (task) { return task.id === id; })[0];
        task.done = newState;
        this.saveState();
        this.updateCallback(this.tasks);
    };
    TaskManager.prototype.nextDayCallback = function (id, newState) {
        var task = this.tasks.filter(function (task) { return task.id === id; })[0];
        task.markedForNextDay = newState;
        this.saveState();
        this.updateCallback(this.tasks);
    };
    return TaskManager;
}());
