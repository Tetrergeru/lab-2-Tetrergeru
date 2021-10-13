document.addEventListener('DOMContentLoaded', () => {
  const state = getStoredStateOrDefault({
    tasks: [{
      text: "Make sfedu great again!",
      done: false,
      id: 0,
    }, {
      text: "Make sfedu even greater! Far more greater! Greater than sun!",
      done: false,
      id: 1,
    }],
    currentId: 2
  })

  const $gauge = document.querySelector('.gauge')! as HTMLDivElement

  const updateGauge = () => {
    let totalTasks = state.tasks.length
    let doneTasks = state.tasks.filter(task => task.done).length
    setGaugePercent($gauge, totalTasks == 0 ? 0 : (doneTasks / totalTasks) * 100)
  }

  const taskList = document.querySelector('.task-container')! as HTMLDivElement
  const createButton = document.querySelector('.task-creator__button')!
  const taskNameInput = document.querySelector('.task-creator__text')! as HTMLInputElement

  const taskDestructor = (ev: MouseEvent) => {
    const parent = (ev.target as HTMLDivElement).parentElement!
    const id = +parent.getAttribute("data-id")!;

    state.tasks = state.tasks.filter(element => element.id !== id)
    saveState(state)
    updateGauge()
  }

  const checkboxCallback = (ev: MouseEvent, newState: boolean) => {
    const parent = (ev.target as HTMLDivElement).parentElement!
    const id = +parent.getAttribute("data-id")!;
    const [task] = state.tasks.filter(task => task.id === id)
    task.done = newState
    saveState(state)
    updateGauge()
  }

  for (const task of state.tasks) {
    addTask(taskList, task.text, task.id, taskDestructor, checkboxCallback)
  }

  createButton.addEventListener('click', () => {
    const task = {
      text: taskNameInput.value,
      done: false,
      id: state.currentId++,
    }

    addTask(taskList, task.text, task.id, taskDestructor, checkboxCallback)

    state.tasks.push(task)
    saveState(state)
    updateGauge()

    taskNameInput.value = ""
  })

  updateGauge()
})

function addTask(
  taskList: HTMLDivElement,
  text: string,
  id: number,
  removeCallback: (ev: MouseEvent) => void = () => { },
  checkboxCallback: (ev: MouseEvent, newState: boolean) => void = () => { }
) {
  const deleteButton = createDiv(["delete-button"])
  const checkbox = createDiv(['checkbox'])
  const textbox = createDiv(['text'], text)

  const task = createDiv(['task'], [checkbox, textbox, deleteButton]);
  task.setAttribute("data-id", id.toString())

  checkbox.addEventListener('click', (e) => {
    const target = e.target as HTMLDivElement
    if (target.classList.contains("checked")) {
      target.classList.remove("checked")
      textbox.classList.remove("strike")
      checkboxCallback(e, false)
    } else {
      target.classList.add("checked")
      textbox.classList.add("strike")
      checkboxCallback(e, true)
    }
  })

  const clickHandler = (ev: MouseEvent) => {
    task.remove()
    deleteButton.removeEventListener('click', clickHandler)
    removeCallback(ev)
  }
  deleteButton.addEventListener('click', clickHandler)

  taskList.insertBefore(task, taskList.children[taskList.children.length - 1])
}

function createDiv(styles: string[] = [], content: HTMLElement[] | string = ""): HTMLElement {
  const div = document.createElement('div')
  for (const style of styles)
    div.classList.add(style)
  if (typeof (content) === 'string') {
    div.innerText = content
  } else {
    for (const child of content) {
      div.appendChild(child)
    }
  }
  return div
}