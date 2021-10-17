"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var taskManager = new TaskManager(function (tasks) {
        reloadState();
        if (state === 'SomeTasks') {
            var gauge = document.querySelector('.gauge');
            var tasksLeft = document.querySelector('.tasks-left');
            var totalTasks = tasks.length;
            var doneTasks = tasks.filter(function (task) { return task.done; }).length;
            var donePercents = totalTasks == 0 ? 0 : doneTasks / totalTasks * 100;
            setGaugePercent(gauge, +donePercents.toPrecision(2));
            var tasksToDo = totalTasks - doneTasks;
            tasksLeft.innerText = tasksToDo + " task" + (tasksToDo === 1 ? "" : "s") + " to do";
        }
    });
    var container = document.querySelector('.container');
    var addTask = function () {
        taskManager.addTask(taskNameInput.value);
        taskNameInput.value = "";
    };
    var createButton;
    var taskNameInput;
    var state = taskManager.state;
    var clearState = function (state) {
        if (state === 'SomeTasks') {
            taskManager.removeFromPage();
        }
        createButton.removeEventListener('click', addTask);
    };
    var loadState = function (state) {
        if (state === 'SomeTasks') {
            container.innerHTML = containerWithSomeTasks;
            taskManager.loadOntoPage();
        }
        else if (state == 'NoTasks') {
            container.innerHTML = containerWithNoTasks;
        }
        else if (state == 'AllDone') {
            container.innerHTML = containerWithAllDone;
        }
        createButton = document.querySelector('.task-creator__button');
        taskNameInput = document.querySelector('.task-creator__text');
        createButton.addEventListener('click', addTask);
    };
    var reloadState = function () {
        var newState = taskManager.state;
        var oldState = state;
        console.log(oldState, newState);
        state = newState;
        if (oldState != newState) {
            clearState(oldState);
            loadState(newState);
        }
    };
    loadState(state);
    var newDayButton = document.querySelector('.new-day-button');
    newDayButton.addEventListener('click', function () {
        taskManager.nextDay();
        reloadState();
    });
});
