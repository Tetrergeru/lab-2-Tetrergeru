type State = {
    tasks: RawTask[],
    currentId: number,
}

type RawTask = {
    id: number,
    text: string,
    done?: boolean,
    markedForNextDay?: boolean,
}

class Task {
    public id: number
    public text: string
    public done: boolean
    public markedForNextDay: boolean

    public constructor(task: RawTask) {
        this.text = task.text
        this.id = task.id
        this.done = task.done || false
        this.markedForNextDay = task.markedForNextDay || false
    }
}

class TaskManager {
    private tasks: Task[] = []
    private currentId: number = NaN
    private taskList: HTMLDivElement
    private updateCallback: (tasks: Task[]) => void

    public constructor(updateCallback: (tasks: Task[]) => void) {
        this.loadState()
        this.taskList = document.querySelector('.task-container')! as HTMLDivElement
        this.updateCallback = updateCallback

        for (const task of this.tasks) {
            this.createTaskHtml(task.text, task.id)
        }
        updateCallback(this.tasks)
    }

    public addTask(text: string) {
        const task = new Task({ id: this.currentId++, text: text })

        this.tasks.push(task)
        this.saveState()

        this.createTaskHtml(task.text, task.id)
    }

    private loadState() {
        const state = getStoredStateOrDefault({ tasks: [], currentId: 0 } as State)
        this.tasks = state.tasks.map(task => new Task(task))
        this.currentId = state.currentId
    }

    private saveState() {
        saveState({ tasks: this.tasks, currentId: this.currentId } as State)
    }

    private createTaskHtml(text: string, id: number) {
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
                this.checkboxCallback(e, false)
            } else {
                target.classList.add("checked")
                textbox.classList.add("strike")
                this.checkboxCallback(e, true)
            }
        })

        const clickHandler = (ev: MouseEvent) => {
            task.remove()
            deleteButton.removeEventListener('click', clickHandler)
            this.taskDestructor(ev)
        }
        deleteButton.addEventListener('click', clickHandler)

        this.taskList.insertBefore(task, this.taskList.children[this.taskList.children.length - 1])
    }

    public taskDestructor(ev: MouseEvent) {
        const parent = (ev.target as HTMLDivElement).parentElement!
        const id = +parent.getAttribute("data-id")!;

        this.tasks = this.tasks.filter(element => element.id !== id)
        this.saveState()
        this.updateCallback(this.tasks)
    }

    public checkboxCallback(ev: MouseEvent, newState: boolean) {
        const parent = (ev.target as HTMLDivElement).parentElement!
        const id = +parent.getAttribute("data-id")!;
        const [task] = this.tasks.filter(task => task.id === id)

        task.done = newState

        this.saveState()
        this.updateCallback(this.tasks)
    }
}