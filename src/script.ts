window.addEventListener("load", () => {
  enum TaskStatus {
    default,
    inProgress,
    completed,
  }

  class TodoApp {
    private list = document.getElementById("list") as HTMLUListElement;
    private form = document.getElementById("addTodoItem") as HTMLFormElement;
    private input = document.getElementById("newTask") as HTMLInputElement;
    public tasks: Task[] = [];
    constructor() {
      this.form?.addEventListener("submit", (e) => this.addTask(e));
    }

    private addTask(e: SubmitEvent) {
      e.preventDefault();
      if (this.input?.value == "" || this.input?.value == null) return;

      this.tasks.push(new Task(this, this.list, this.input.value));
      this.input.value = "";
      this.updateList();
    }

    public removeTask(task: Task) {
      this.tasks.splice(this.tasks.indexOf(task), 1);
      this.updateList();
    }

    public updateList() {}
  }

  class Task {
    public root: HTMLLIElement;
    private _status: TaskStatus = 0;

    public set status(status: TaskStatus) {
      this._status = status;
    }

    public get status() {
      return this._status;
    }

    constructor(
      private owner: TodoApp,
      private parent: HTMLUListElement,
      private title: string
    ) {
      this.root = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      label.append(checkbox, this.title);

      const rIcon = document.createElement("img");
      rIcon.src = "../media/trashIcon.svg";
      const rBtn = document.createElement("a");
      rBtn.append(rIcon);

      this.root.append(label, rBtn);
      this.parent.prepend(this.root);

      checkbox.addEventListener("change", () => this.changeStatus());
      rBtn.addEventListener("click", () => this.remove());
    }

    private changeStatus() {
      switch (this.status) {
        case 0:
          this.status = 1;
          this.root.classList.add("inProgress");
          break;
        case 1:
          this.status = 2;
          this.root.classList.remove("inProgress");
          this.root.classList.add("completed");
          break;
        case 2:
          this.status = 0;
          this.root.classList.remove("completed");
          break;
      }
      this.owner.updateList();
    }

    private remove() {
      this.root.remove();
      this.owner.removeTask(this);
    }
  }

  new TodoApp();
});
