type AppState = 'NoTasks' | 'SomeTasks' | 'AllDone'

document.addEventListener('DOMContentLoaded', () => {

  const taskManager = new TaskManager((tasks) => {
    reloadState()
    if (state === 'SomeTasks') {
      const gauge = document.querySelector('.gauge')! as HTMLDivElement
      const tasksLeft = document.querySelector('.tasks-left')! as HTMLDivElement

      const totalTasks = tasks.length
      const doneTasks = tasks.filter(task => task.done).length
      const donePercents = totalTasks == 0 ? 0 : doneTasks / totalTasks * 100
      setGaugePercent(gauge, +donePercents.toPrecision(2))

      const tasksToDo = totalTasks - doneTasks
      tasksLeft.innerText = `${tasksToDo} task${tasksToDo === 1 ? "" : "s"} to do`
    }
  });

  const container = document.querySelector('.container')! as HTMLDivElement

  const addTask = () => {
    taskManager.addTask(taskNameInput.value);
    taskNameInput.value = ""
  }

  let createButton: HTMLDivElement
  let taskNameInput: HTMLInputElement

  let state = taskManager.state
  const clearState = (state: AppState) => {
    if (state === 'SomeTasks') {
      taskManager.removeFromPage()
    }
    createButton.removeEventListener('click', addTask)
  }
  const loadState = (state: AppState) => {
    if (state === 'SomeTasks') {
      container.innerHTML = containerWithSomeTasks
      taskManager.loadOntoPage()
    } else if (state == 'NoTasks') {
      container.innerHTML = containerWithNoTasks
    } else if (state == 'AllDone') {
      container.innerHTML = containerWithAllDone
    }
    createButton = document.querySelector('.task-creator__button')!
    taskNameInput = document.querySelector('.task-creator__text')! as HTMLInputElement
    createButton.addEventListener('click', addTask)
  }
  const reloadState = () => {
    let newState = taskManager.state
    let oldState = state
    console.log(oldState, newState)
    state = newState
    if (oldState != newState) {
      clearState(oldState)
      loadState(newState)
    }
  }

  loadState(state)

  const newDayButton = document.querySelector('.new-day-button')! as HTMLDivElement
  newDayButton.addEventListener('click', () => {
    taskManager.nextDay()
    reloadState()
  })
})
