"use strict";
window.addEventListener("load", () => {
    let TaskStatus;
    (function (TaskStatus) {
        TaskStatus[TaskStatus["default"] = 0] = "default";
        TaskStatus[TaskStatus["inProgress"] = 1] = "inProgress";
        TaskStatus[TaskStatus["completed"] = 2] = "completed";
    })(TaskStatus || (TaskStatus = {}));
    class TodoApp {
        constructor() {
            var _a;
            this.list = document.getElementById("list");
            this.form = document.getElementById("addTodoItem");
            this.inputTitle = document.getElementById("newTask");
            this.tasks = this.loadTasks();
            this.tasks.forEach((taskData) => new Task(this, taskData));
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
                var _a, _b;
                e.preventDefault();
                if (((_a = this.inputTitle) === null || _a === void 0 ? void 0 : _a.value) == "" || ((_b = this.inputTitle) === null || _b === void 0 ? void 0 : _b.value) == null)
                    return;
                this.tasks.push(new Task(this, { status: 0, title: this.inputTitle.value }).data);
                this.saveTasks();
                this.inputTitle.value = "";
            });
        }
        loadTasks() {
            const tasksJSON = localStorage.getItem("TASKS");
            if (tasksJSON == null)
                return [];
            return JSON.parse(tasksJSON);
        }
        saveTasks() {
            const taskJSON = JSON.stringify(this.tasks);
            localStorage.setItem("TASKS", taskJSON);
        }
    }
    class Task {
        constructor(owner, data) {
            this.owner = owner;
            this.data = data;
            this.root = document.createElement("li");
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            label.append(checkbox, this.data.title);
            const rIcon = document.createElement("img");
            rIcon.src = "./media/trashIcon.svg";
            const rBtn = document.createElement("a");
            rBtn.append(rIcon);
            this.root.append(label, rBtn);
            this.owner.list.prepend(this.root);
            this.setStatus();
            checkbox.addEventListener("change", () => this.changeStatus());
            rBtn.addEventListener("click", () => this.removeTask());
        }
        setStatus() {
            if (this.data.status == 1)
                this.root.classList.add("inProgress");
            if (this.data.status == 2)
                this.root.classList.add("completed");
        }
        changeStatus() {
            switch (this.data.status) {
                case 0:
                    this.data.status = 1;
                    this.root.classList.add("inProgress");
                    break;
                case 1:
                    this.data.status = 2;
                    this.root.classList.remove("inProgress");
                    this.root.classList.add("completed");
                    break;
                case 2:
                    this.data.status = 0;
                    this.root.classList.remove("completed");
                    break;
            }
            this.owner.saveTasks();
        }
        removeTask() {
            this.root.remove();
            this.owner.tasks.splice(this.owner.tasks.indexOf(this.data), 1);
            this.owner.saveTasks();
        }
    }
    new TodoApp();
});
