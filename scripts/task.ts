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

    public constructor(task: RawTask, parent: TaskManager) {
        this.text = task.text
        this.id = task.id
        this.done = task.done || false
        this.markedForNextDay = task.markedForNextDay || false
    }

    public destructor: () => void = () => { }
}

class TaskManager {
    private tasks: Task[] = []
    private currentId: number = NaN
    private taskList: HTMLDivElement
    private updateCallback: (tasks: Task[]) => void
    private ctrlPressed: boolean = false

    public constructor(updateCallback: (tasks: Task[]) => void) {
        this.loadState()
        this.taskList = document.querySelector('.task-container')! as HTMLDivElement
        this.updateCallback = updateCallback

        document.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Control')
                this.ctrlPressed = true
        })
        document.addEventListener('keyup', (e) => {
            if ((e as KeyboardEvent).key === 'Control')
                this.ctrlPressed = false
        })

        for (const task of this.tasks) {
            this.createTaskCard(task)
        }
        updateCallback(this.tasks)
    }

    public addTask(text: string) {
        this.addRawTask({ id: this.currentId++, text: text })
    }

    public addRawTask(rawTask: RawTask) {
        const task = new Task(rawTask, this)

        this.tasks.push(task)
        this.saveState()

        this.createTaskCard(task)
    }

    public nextDay() {
        let newTasks = this.tasks
            .filter(task => task.markedForNextDay)
            .map(task => {
                task.markedForNextDay = false
                return task
            })
            .map(task => task as RawTask)
        this.tasks.forEach(task => task.destructor())
        this.tasks = []
        newTasks.forEach(task => this.addRawTask(task))
    }

    private loadState() {
        const state = getStoredStateOrDefault({ tasks: [], currentId: 0 } as State)
        this.tasks = state.tasks.map(task => new Task(task, this))
        this.currentId = state.currentId
    }

    private saveState() {
        saveState({ tasks: this.tasks.map(task => task as RawTask), currentId: this.currentId } as State)
    }

    private createTaskCard(task: Task) {
        const deleteButton = createDiv(["delete-button"], svgCross, true)
        const checkbox = createDiv(['checkbox'], svgOk, true)
        const textbox = createDiv(['text'], task.text)

        const taskCard = createDiv(['task'], [checkbox, textbox, deleteButton]);
        taskCard.setAttribute("data-id", task.id.toString())

        taskCard.addEventListener('click', (ev) => {
            if (!this.ctrlPressed)
                return

            if (taskCard.classList.contains("next-day")) {
                taskCard.classList.remove("next-day")
                this.nextDayCallback(task.id, false)
            } else {
                taskCard.classList.add("next-day")
                this.nextDayCallback(task.id, true)
            }
        })

        checkbox.addEventListener('click', (e) => {
            const target = e.target as HTMLDivElement
            if (target.classList.contains("checked")) {
                target.classList.remove("checked")
                textbox.classList.remove("strike")
                this.checkboxClick(task.id, false)
            } else {
                target.classList.add("checked")
                textbox.classList.add("strike")
                this.checkboxClick(task.id, true)
            }
        })

        task.destructor = () => {
            taskCard.remove()
            deleteButton.removeEventListener('click', task.destructor)
            this.deleteTask(task.id)
        }
        deleteButton.addEventListener('click', task.destructor)
        this.taskList.insertBefore(taskCard, this.taskList.children[this.taskList.children.length - 1])
    }

    public deleteTask(id: number) {
        this.tasks = this.tasks.filter(element => element.id !== id)
        this.saveState()
        this.updateCallback(this.tasks)
    }

    public checkboxClick(id: number, newState: boolean) {
        const [task] = this.tasks.filter(task => task.id === id)

        task.done = newState

        this.saveState()
        this.updateCallback(this.tasks)
    }

    public nextDayCallback(id: number, newState: boolean) {
        const [task] = this.tasks.filter(task => task.id === id)

        task.markedForNextDay = newState

        this.saveState()
        this.updateCallback(this.tasks)
    }
}