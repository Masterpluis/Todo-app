window.addEventListener("load", () => {
	enum TaskStatus {
		default,
		inProgress,
		completed,
	}

	type TaskData = {
		status: TaskStatus;
		title: string;
	};

	class TodoApp {
		public list = document.getElementById("list") as HTMLUListElement;
		private form = document.getElementById("addTodoItem") as HTMLFormElement;
		private inputTitle = document.getElementById("newTask") as HTMLInputElement;
		public tasks: TaskData[] = this.loadTasks();
		constructor() {
			this.tasks.forEach((taskData) => new Task(this, taskData));
			this.form?.addEventListener("submit", (e) => {
				e.preventDefault();
				if (this.inputTitle?.value == "" || this.inputTitle?.value == null) return;

				this.tasks.push(new Task(this, {status: 0, title: this.inputTitle.value}).data);
				this.saveTasks();
				this.inputTitle.value = "";
			});
		}

		private loadTasks() {
			const tasksJSON = localStorage.getItem("TASKS");
			if (tasksJSON == null) return [];
			return JSON.parse(tasksJSON);
		}

		public saveTasks() {
			const taskJSON = JSON.stringify(this.tasks);
			localStorage.setItem("TASKS", taskJSON);
		}
	}

	class Task {
		private root: HTMLLIElement;
		constructor(private owner: TodoApp, public data: TaskData) {
			this.root = document.createElement("li");
			const label = document.createElement("label");
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			label.append(checkbox, this.data.title);
			const rIcon = document.createElement("img");
			rIcon.src = "../media/trashIcon.svg";
			const rBtn = document.createElement("a");
			rBtn.append(rIcon);
			this.root.append(label, rBtn);
			this.owner.list.prepend(this.root);

			this.setStatus();
			checkbox.addEventListener("change", () => this.changeStatus());
			rBtn.addEventListener("click", () => this.removeTask());
		}

		private setStatus() {
			if (this.data.status == 1) this.root.classList.add("inProgress");
			if (this.data.status == 2) this.root.classList.add("completed");
		}

		private changeStatus() {
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
		
		private removeTask() {
			this.root.remove();
			this.owner.tasks.splice(this.owner.tasks.indexOf(this.data), 1);
			this.owner.saveTasks();
		}
	}

	new TodoApp();
});
