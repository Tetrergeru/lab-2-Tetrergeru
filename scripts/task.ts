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

    public destructor: () => void = () => { }
}

class TaskManager {
    private tasks: Task[] = []
    private currentId: number = NaN
    private taskList: HTMLDivElement | null = null
    private updateCallback: (tasks: Task[]) => void
    private ctrlPressed: boolean = false

    public constructor(updateCallback: (tasks: Task[]) => void) {
        this.loadState()
        this.updateCallback = updateCallback

        document.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Control')
                this.ctrlPressed = true
        })
        document.addEventListener('keyup', (e) => {
            if ((e as KeyboardEvent).key === 'Control')
                this.ctrlPressed = false
        })
    }

    public get state(): AppState {
        return this.totalTasks === 0
            ? 'NoTasks' : this.todoTasks === 0
                ? 'AllDone' : 'SomeTasks'
    }

    public get todoTasks(): number {
        return this.tasks.filter(task => !task.done).length
    }

    public get totalTasks(): number {
        return this.tasks.length
    }
    
    public loadOntoPage() {
        this.taskList = document.querySelector('.task-container')! as HTMLDivElement
        for (const task of this.tasks) {
            this.createTaskCard(task)
        }
        this.updateCallback(this.tasks)
    }

    public removeFromPage() {
        for (const task of this.tasks) {
            task.destructor()
        }
        this.updateCallback(this.tasks)
    }

    public addTask(text: string) {
        this.addRawTask({ id: this.currentId++, text: text })
    }

    public addRawTask(rawTask: RawTask) {
        const task = new Task(rawTask)

        this.tasks.push(task)
        this.saveState()

        this.createTaskCard(task)
        this.updateCallback(this.tasks)
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
        this.tasks = state.tasks.map(task => new Task(task))
        this.currentId = state.currentId
    }

    private saveState() {
        saveState({ tasks: this.tasks.map(task => task as RawTask), currentId: this.currentId } as State)
    }

    private createTaskCard(task: Task) {
        const deleteButton = createDiv(["delete-button"], svgCross, true)
        const checkbox = createDiv(['checkbox'], svgOk, true)
        const textBox = createDiv(['text'], task.text)

        const taskCard = createDiv(['task'], [checkbox, textBox, deleteButton]);
        taskCard.setAttribute("data-id", task.id.toString())

        const nextDayUpdater = () => {
            if (!this.ctrlPressed)
                return

            if (task.markedForNextDay) {
                taskCard.classList.remove("next-day")
                this.nextDayCallback(task.id, false)
            } else {
                taskCard.classList.add("next-day")
                this.nextDayCallback(task.id, true)
            }
        }
        taskCard.addEventListener('click', nextDayUpdater)

        const checkboxUpdater = () => {
            if (task.done) {
                checkbox.classList.add("checked")
                textBox.classList.add("strike")
            } else {
                checkbox.classList.remove("checked")
                textBox.classList.remove("strike")
            }
        }
        checkbox.addEventListener('click', () => {
            this.checkboxClick(task.id, !task.done)
            checkboxUpdater()
        })
        checkboxUpdater()

        task.destructor = () => {
            taskCard.remove()
            deleteButton.removeEventListener('click', task.destructor)
        }
        deleteButton.addEventListener('click', () => {
            this.deleteTask(task.id)
            task.destructor()
        })
        this.taskList?.insertBefore(taskCard, this.taskList.children[this.taskList.children.length - 1])
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