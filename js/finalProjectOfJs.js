const containerEl = document.querySelector(".container");
const toDoList = document.querySelector("#to-do-list");
// Task Form & details
const formEl = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const creatBtn = document.querySelector(".creat-task");
const editBtn = document.querySelector(".edit-task");
const taskNumber = document.querySelector("#task-number");
// Task list
const ulTaskList = document.querySelector("#task-list");
const liTask = document.querySelector("#task-list > li");
// Done-task
const doneEL = document.querySelector(".completed");
const ulComplete = document.querySelector("#completed-list");
const liDone = document.querySelector("#completed-list > li");
// random id
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

taskInput.focus();
//   URR FOR FETCH
const url = "http://localhost:3000";
// get all tasks
const getTasks = async () => {
  ulTaskList.innerHTML = "";
  const response = await fetch(url + "/tasks");
  const tasks = await response.json();
  tasks.forEach((task) => {
    ulTaskList.innerHTML += `<li>
        <p>${task.taskToDo}</p>
        <div data-id="${task.id}">
        <i class='bx bxs-edit'></i>
        <i class='bx bxs-trash'></i>
        <i class='bx bx-checkbox-checked'></i>
        </div>
    </li>`;
  });
};
//   get a single task
const getTask = async (id) => {
  const response = await fetch(url + `/tasks/${id}`);
  const Task = await response.json();
  taskInput.value = Task.taskToDo;
  return Task;
};
// creat a new task
const creatTask = async (creatingData) => {
  const response = await fetch(url + "/tasks", {
    method: "POST",
    body: JSON.stringify(creatingData),
    headers: {
      "Content-type": "application/json",
    },
  });

  taskInput.value = "";
};

formEl.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (taskInput.value.trim()) {
    const creatingData = {
      taskToDo: taskInput.value,
      id: generateUniqueId(),
    };
    await creatTask(creatingData);

    await getTasks();
  } else {
    alert("please enter task");
  }
});
//  delete the single task
const deleteTask = async (id) => {
  const response = await fetch(url + `/tasks/${id}`, {
    method: "DELETE",
  });
};
// delete and edit
toDoList.addEventListener("click", async function (e) {
  const id = e.target.parentElement.dataset.id;

  if (e.target.classList.contains("bxs-trash")) {
    deletePopUp = confirm("Are you Sure To Delete This Task?");
    if (deletePopUp && id) {
      await deleteTask(id);
      await getTasks();
    }
  }
  if (e.target.classList.contains("bxs-edit")) {
    await getTask(id);
    creatBtn.style.display = "none";
    editBtn.style.display = "block";
    editBtn.id = id;
  }

  if (e.target.classList.contains("bx-checkbox-checked")) {
    const taskId = e.target.parentElement.dataset.id; // Get the task ID
    const taskData = await getTask(taskId);
    await creatDone(taskData);
    await deleteTask(taskId);
    await getTasks();
    await getDones();
  }
});
// edit function
const editTask = async (id) => {
  const editingData = {
    taskToDo: taskInput.value,
  };

  if (taskInput.value.trim()) {
    const response = await fetch(url + `/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(editingData),
      headers: {
        "Content-type": "application/json",
      },
    });
  } else {
    alert("You Can't Leave A Title Empty:)");
  }
};
// EDIT BUTTON
editBtn.addEventListener("click", async function (id) {
  await editTask(this.id);
  creatBtn.style.display = "block";
  editBtn.style.display = "none";
  taskInput.value = "";
  await getTasks();
});
// get dones
const getDones = async () => {
  ulComplete.innerHTML = "";
  const response = await fetch(url + "/dones");
  const dones = await response.json();
  dones.forEach((done) => {
    ulComplete.innerHTML += `<li>
        <p>${done.taskToDo}</p>
        <div data-id="${done.id}">
            <i class='bx bxs-trash'></i>
            <i class='bx bx-undo'></i>
        </div>
    </li>`;
  });
};
// get single done
const getDone = async (id) => {
  const response = await fetch(url + `/dones/${id}`);
  const Done = await response.json();
  return Done;
};
// creat a new done
const creatDone = async (creatingData) => {
  const response = await fetch(url + "/dones", {
    method: "POST",
    body: JSON.stringify(creatingData),
    headers: {
      "Content-type": "application/json",
    },
  });
};
//  delete the single done
const deleteDone = async (id) => {
  const response = await fetch(url + `/dones/${id}`, {
    method: "DELETE",
  });
};
doneEL.addEventListener("click", async function (e) {
  const id = e.target.parentElement.dataset.id;

  if (e.target.classList.contains("bxs-trash")) {
    deletePopUp = confirm("Are you Sure To Delete This Task?");
    if (deletePopUp && id) {
      await deleteDone(id);
      await getDones();
    }
  }

  if (e.target.classList.contains("bx-undo")) {
    const taskData = await getDone(id);
    await creatTask(taskData);
    await deleteDone(id);

    await getTasks();
    await getDones();
  }
});

getTasks();
getDones();
