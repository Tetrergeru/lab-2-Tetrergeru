document.addEventListener('DOMContentLoaded', () => {
  const state = getStoredStateOrDefault({
    counter: 40
  })

  const $incrButton = document.querySelector('.incr')!
  const $decrButton = document.querySelector('.decr')!


  const $gauge = document.querySelector('.gauge')! as HTMLDivElement
  setGaugePercent($gauge, state.counter)

  $incrButton.addEventListener('click', () => {
    state.counter = Math.min(state.counter + 10, 100)
    saveState(state)
    setGaugePercent($gauge, state.counter)
  })

  $decrButton.addEventListener('click', () => {
    state.counter = Math.max(state.counter - 10, 0)
    saveState(state)
    setGaugePercent($gauge, state.counter)
  })

  const createButton = document.querySelector('.create-task')!
  const taskList = document.querySelector('.task-container')! as HTMLDivElement
  createButton.addEventListener('click', () => {
    let deleteButton = createDiv(["delete-button"])
    
    const task = createDiv(['task'], [
      createDiv(['checkbox']),
      createDiv(['text'], "Make sfedu great again"),
      deleteButton,
    ]);

    const clickHandler = () => {
      task.remove()
      deleteButton.removeEventListener('click', clickHandler)
    }
    deleteButton.addEventListener('click', clickHandler)

    taskList.appendChild(task)
  })
})

function createDiv(styles: string[] = [], content: HTMLElement[] | string = ""): HTMLElement {
  const div = document.createElement('div')
  for (const style of styles)
    div.classList.add(style)
  if (typeof (content) === 'string') {
    div.innerText = content
  } else {
    for (const child of content){
      div.appendChild(child)
    }
  }
  return div
}