document.addEventListener('DOMContentLoaded', () => {

  const gauge = document.querySelector('.gauge')! as HTMLDivElement

  const taskManager = new TaskManager((tasks) => {
    const totalTasks = tasks.length
    const doneTasks = tasks.filter(task => task.done).length
    const donePercents = totalTasks == 0 ? 0 : doneTasks / totalTasks * 100
    setGaugePercent(gauge, +donePercents.toPrecision(2))
  });

  const newDayButton = document.querySelector('.new-day-button')! as HTMLDivElement

  newDayButton.addEventListener('click', () => {
    taskManager.nextDay();
  })
  newDayButton.addEventListener('mousedown', () => {
    newDayButton.classList.add('new-day-button__down')
  })
  newDayButton.addEventListener('mouseup', () => {
    newDayButton.classList.remove('new-day-button__down')
  })

  const createButton = document.querySelector('.task-creator__button')!
  const taskNameInput = document.querySelector('.task-creator__text')! as HTMLInputElement

  createButton.addEventListener('click', () => {
    taskManager.addTask(taskNameInput.value);
    taskNameInput.value = ""
  })
})
