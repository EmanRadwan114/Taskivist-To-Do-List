// todo: declare global variables
let InputName = document.getElementById("taskName"),
  InputDate = document.getElementById("taskDate"),
  submitBtn = document.getElementById("addTaskBtn"),
  UpdateTaskBtn = document.getElementById("UpdateTaskBtn"),
  singleTask = document.getElementsByClassName("singleTask"),
  taskModal = document.getElementById("taskModal"), // task modal container
  taskDetails = document.getElementById("taskDetails"), // task modal content
  validationBox = document.getElementById("validationBox"), // task validation modal Box
  validationModal = document.getElementById("validationModal"), // task  validation modal content
  deleteBox = document.getElementById("deleteBox"), // delete modal container
  deleteModal = document.getElementById("deleteModal"), // delete modal content
  controlsBtn = document.getElementsByClassName("taskBtns"), // controls btns
  controlsIcon = document.getElementsByClassName("controlsIcon"), // controls icons (three dots)
  currentIndex, // global counter
  deleteIndex,
  tasksContainer = []; // empty container

//todo: display saved tasks from local storage
if (localStorage.getItem("tasks") !== null) {
  tasksContainer = JSON.parse(localStorage.getItem("tasks"));
  tasksContainer.sort((a, b) => Number(a.taskDate) - Number(b.taskDate));
  console.log(
    tasksContainer.sort((a, b) => Number(a.taskDate) - Number(b.taskDate))
  );

  displayTasks();
  updateTaskStatus();
  manageControlBtns();
}
if (tasksContainer.length === 0) {
  document.getElementById(
    "listContainer"
  ).innerHTML = `<p class="fs-4 fw-semibold text-center noTasks">
                You don't have tasks here!
              </p>`;
}

//todo: create a function that get today's date and display it in the current date variable
function getCurrentDate() {
  let todaysdate = new Date().toLocaleDateString();
  return todaysdate;
}

document.getElementById("currentDay").innerHTML = getCurrentDate();

// todo: create a function that opens Modal Box when user click on addBtn
function openTaskModal(modalBox, modalContent) {
  modalBox.classList.replace("invisible", "visible");
  modalBox.classList.replace("opacity-0", "opacity-100");
  modalContent.style.transform = "translateY(0)";
}

// todo: call openTaskModal function when user click on addBtn
document.getElementById("addBtn").addEventListener("click", function () {
  openTaskModal(taskModal, taskDetails);
  resetTask();
  UpdateTaskBtn.classList.replace("d-block", "d-none");
  submitBtn.classList.replace("d-none", "d-block");
});

// todo: create or update tasks on enter
InputName.addEventListener("keydown", function (e) {
  createOnEnter(e);
});

InputDate.addEventListener("keydown", function (e) {
  createOnEnter(e);
});

//todo: create a function that create a task when user click on enter btn
function createOnEnter(enterKey) {
  if (enterKey.key == "Enter") {
    preventEmptyValues();
    updateTaskStatus();
  }
}

//todo: create a function that close the modal Bok when user click on submitBtn
function closeTaskModal(modalBox, modalContent) {
  modalBox.classList.replace("visible", "invisible");
  modalBox.classList.replace("opacity-100", "opacity-0");
  modalContent.style.transform = "translateY(-150px)";
}

// todo: close modals/box
window.addEventListener("click", function (event) {
  // close the taskModal when user click on any place outside the modal box or on closeBtn
  if (
    event.target == taskModal ||
    event.target == document.getElementById("container")
  ) {
    closeTaskModal(taskModal, taskDetails);
  }

  //close delete modal when user click on anything outside delete modal
  if (event.target == deleteBox) {
    closeTaskModal(deleteBox, deleteModal);
  }

  // close validation modal when user click outside the box
  if (event.target == validationBox) {
    closeTaskModal(validationBox, validationModal);
  }

  // close task controls box when user click outside the box/on any other task controls
  for (let i = 0; i < controlsIcon.length; i++) {
    if (event.target !== controlsIcon[i] && event.target !== controlsBtn[i]) {
      controlsBtn[i].classList.replace("visible", "invisible");
      controlsBtn[i].classList.replace("opacity-100", "opacity-0");
    }
  }
});

document.getElementById("closeBtn").addEventListener("click", function () {
  closeTaskModal(taskModal, taskDetails);
});

// //todo: make the minimum value allowed in the data time local input
let currentDate = new Date();
let minTimeDate = new Date(
  currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
)
  .toJSON()
  .slice(0, 16);
InputDate.min = `${minTimeDate}`;

//todo: create a function that change formate of toJSON Date Object to a more readable one
function changeDateFormate(task, taskDate) {
  let myDate = new Date(task.taskDate), // get the value of taskdate and extract date from it
    suffex = "", // to write pm or am
    // check if hour is in am or pm
    myDay = myDate.getDate(),
    myMonth = myDate.getMonth() + 1,
    myYear = myDate.getFullYear(),
    myHour = myDate.getHours(),
    myMin = myDate.getMinutes();
  console.log(myDate);
  if (myHour >= 12) {
    suffex = "PM";
  } else {
    suffex = "AM";
  }
  if (myMin < 10) {
    myMin = `0${myMin}`;
  }

  // assign the new date formate to taskdate & change the date formate to a more readable one
  task.taskDate =
    myDay +
    "-" +
    myMonth +
    "-" +
    myYear +
    " " +
    (((myHour + 11) % 12) + 1) + // conert 24h format to 12h formats
    ":" +
    myMin +
    " " +
    suffex;
}

// todo: create a function that create object for tasks and push it in an array
function createTask() {
  let sortedTaskContainer,
    task = {
      taskName: InputName.value.trim(),
      taskDate: InputDate.value,
      taskStatus: "open",
    };
  if (InputDate.value === "") {
    task.taskDate = "";
    tasksContainer.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksContainer));
    closeTaskModal(taskModal, taskDetails);
    displayTasks();
    resetTask();
  } else {
    //diaplay the chosen date in a proper and readable format
    changeDateFormate(task, taskDate);
    // push the updated object with a new formate into the container
    tasksContainer.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksContainer));
    closeTaskModal(taskModal, taskDetails);
    displayTasks();
    resetTask();
  }
}

//todo submit tasks
submitBtn.addEventListener("click", function () {
  //check if the values are empty or not then call createTask function when user click on submitBtn
  preventEmptyValues();
  updateTaskStatus();
});

// if task status is completed, change its style

// todo: create a function that display tasks in the home page
function displayTasks() {
  let taskItems = ``;
  for (let i = 0; i < tasksContainer.length; i++) {
    //display tasks as a list
    taskItems += `
    <li class="singleTask">
    <div
      class="d-flex justify-content-between align-items-center row-gap-2 column-gap-2 flex-nowrap"
    >
      <div
        class="taskInfo d-flex justify-content-start align-items-center column-gap-2"
      >
        <div
          class="circle rounded-circle d-flex justify-content-center align-items-center"
        >
          <i
            class="fa-solid fa-check checkedIcon text-white d-none"
          ></i>
        </div>
        <div>
          <p class="taskName m-0 fs-5 fw-semibold">${tasksContainer[i].taskName}</p>
          <p class="m-0 taskDate">${tasksContainer[i].taskDate}</p>
        </div>
      </div>
      <div
        class="taskControls text-end mt-2 mt-md-0 position-relative"
      >
        <i
          class="fa-solid fa-ellipsis-vertical fs-4 controlsIcon px-2"
        ></i>
        <div
          class="taskBtns d-flex flex-column row-gap-2 justify-content-center align-items-center position-absolute bg-light p-2 shadow-lg mt-1 rounded-2 invisible opacity-0"
        >
          <button class="btn completeBtn fw-semibold fs-6">Complete
           
          </button>
          <button class="btn text-warning editBtn fw-semibold fs-6">Edit
          </button>
          <button class="btn text-danger deleteBtn fw-semibold fs-6">Delete
          </button>
        </div>
      </div>
    </div>
  </li> `;
  }

  document.getElementById("listContainer").innerHTML =
    taskItems ||
    `<p class="fs-4 fw-semibold text-center noTasks">
                You don't have tasks today!
              </p>`;
}

//todo: create a function that delete a task when user click on yes delete btn
function deleteTask(indexTask) {
  singleTask[indexTask].classList.add("d-none");
  tasksContainer.splice(indexTask, 1);
  localStorage.setItem("tasks", JSON.stringify(tasksContainer));
  displayTasks();
  closeTaskModal(deleteBox, deleteModal);
  manageControlBtns();
  if (tasksContainer.length === 0) {
    localStorage.removeItem("tasks");
  }
}

//todo: create a function that shows delete modal box a task when user click on delete btn
function showDeleteModal(index) {
  deleteIndex = index; // to be used as a counter in deleting the corresponding index of task from the array when user click on yes delete
  openTaskModal(deleteBox, deleteModal);
}

// todo: call delete function when user click on yesBtn inside the delete box modal
document.getElementById("yesDelete").addEventListener("click", function (ev) {
  deleteTask(deleteIndex);
  updateTaskStatus();
});

//todo: close delete modal when user click on noBtn or closeBtn
document.getElementById("notDelete").addEventListener("click", function () {
  closeTaskModal(deleteBox, deleteModal);
});
document
  .getElementById("closeDeleteModal")
  .addEventListener("click", function () {
    closeTaskModal(deleteBox, deleteModal);
  });

//todo: create a function that pevent the user from entering empty values
function preventEmptyValues() {
  if (InputName.value === "") {
    openTaskModal(validationBox, validationModal);
    validationModal.style.transform = "translateY(-50px)";
  } else {
    if (submitBtn.classList.contains("d-block")) {
      createTask();
      manageControlBtns();
    } else if (UpdateTaskBtn.classList.contains("d-block")) {
      displayUpdatedTask();
      manageControlBtns();
    }
  }
}

// todo: close validation modal when user click on close btn
document
  .getElementById("closeValidationModal")
  .addEventListener("click", function () {
    closeTaskModal(validationBox, validationModal);
  });

//todo: create a function that reset input values after every task submission
function resetTask() {
  InputName.value = "";
  InputDate.value = "";
}

// todo: create a function that allows the user to edit a task when click on editBtn
function setTaskForEdit(indexValue) {
  currentIndex = indexValue;
  openTaskModal(taskModal, taskDetails);
  InputName.value = tasksContainer[indexValue].taskName;
  InputDate.value = tasksContainer[indexValue].taskDate;
  submitBtn.classList.replace("d-block", "d-none");
  UpdateTaskBtn.classList.replace("d-none", "d-block");
}

// todo: create function to display updated task when user click on update Btn
function displayUpdatedTask() {
  let task = {
    taskName: InputName.value.trim(),
    taskDate: InputDate.value,
    taskStatus: "open",
  };
  if (InputDate.value === "") {
    task.taskDate = "";
    tasksContainer[currentIndex] = task;
    localStorage.setItem("tasks", JSON.stringify(tasksContainer));
    closeTaskModal(taskModal, taskDetails);
    displayTasks();
    UpdateTaskBtn.classList.replace("d-block", "d-none");
    submitBtn.classList.replace("d-none", "d-block");
    resetTask();
  } else {
    changeDateFormate(task, taskDate);
    tasksContainer[currentIndex] = task;
    localStorage.setItem("tasks", JSON.stringify(tasksContainer));
    closeTaskModal(taskModal, taskDetails);
    displayTasks();
    UpdateTaskBtn.classList.replace("d-block", "d-none");
    submitBtn.classList.replace("d-none", "d-block");
    resetTask();
  }
}

UpdateTaskBtn.addEventListener("click", function (ev) {
  preventEmptyValues();
  updateTaskStatus();
});

//todo: create a function that shows controls btns when user click on the three dots
function displayControlsBtns(index) {
  if (!controlsBtn[index].classList.contains("show")) {
    controlsBtn[index].classList.add("show");
    controlsBtn[index].classList.replace("invisible", "visible");
    controlsBtn[index].classList.replace("opacity-0", "opacity-100");
  } else {
    hideControlsBtn(index);
  }
}

//todo: create a function that hides controls btns of one task when user open controls btn of another task
function hideControlsBtn(Controlsindex) {
  controlsBtn[Controlsindex].classList.remove("show");
  controlsBtn[Controlsindex].classList.replace("visible", "invisible");
  controlsBtn[Controlsindex].classList.replace("opacity-100", "opacity-0");
}

//todo: create a function that deals with task controls
function manageControlBtns(counter) {
  //loop over html collection or node list of html elements to control tasks after their display
  for (let i = 0; i < controlsIcon.length; i++) {
    // call displayControlsBtns when user click on controls icon (three dots)
    controlsIcon[i].addEventListener("click", function (e) {
      displayControlsBtns(i);
    });

    // open delete model when click on delete btn
    document
      .getElementsByClassName("deleteBtn")
      [i].addEventListener("click", function (e) {
        hideControlsBtn(i);
        showDeleteModal(i);
      });

    // open task modal to edit a task when user click on edit btn
    document
      .getElementsByClassName("editBtn")
      [i].addEventListener("click", function (e) {
        hideControlsBtn(i);
        setTaskForEdit(i);
      });

    // style completed tasks when clicked on circle/taskname/taskdate
    document
      .querySelectorAll(".taskInfo")
      [i].addEventListener("click", function () {
        isCompleted(i);
      });

    // style completed tasks when clicked on complete btn
    document
      .getElementsByClassName("completeBtn")
      [i].addEventListener("click", function () {
        isCompleted(i);
      });
  }
}

// todo: create a function that delete all tasks when user click on clear all btn
function clearTasks() {
  localStorage.removeItem("tasks");
  tasksContainer = [];
  displayTasks();
}

document.querySelector(".clearAllBtn").addEventListener("click", clearTasks);

//todo: style completed tasks
function styleCompletedTasks(taskStatus) {
  singleTask[taskStatus].style.opacity = "0.6";
  document.getElementsByClassName("taskName")[taskStatus].style.textDecoration =
    "line-through";
  document.getElementsByClassName("taskDate")[taskStatus].style.textDecoration =
    "line-through";
  document.getElementsByClassName("circle")[taskStatus].style.backgroundColor =
    "var(--darkPurple)";
  document
    .getElementsByClassName("checkedIcon")
    [taskStatus].classList.replace("d-none", "d-block");
  document
    .getElementsByClassName("editBtn")
    [taskStatus].setAttribute("disabled", "disabled");
  hideControlsBtn(taskStatus);
}

//todo: style open tasks
function styleOpenTasks(taskStatus) {
  singleTask[taskStatus].style.opacity = "1";
  document.getElementsByClassName("taskName")[taskStatus].style.textDecoration =
    "none";
  document.getElementsByClassName("taskDate")[taskStatus].style.textDecoration =
    "none";
  document.getElementsByClassName("circle")[taskStatus].style.backgroundColor =
    "transparent";
  document
    .getElementsByClassName("checkedIcon")
    [taskStatus].classList.replace("d-block", "d-none");
  document
    .getElementsByClassName("editBtn")
    [taskStatus].removeAttribute("disabled");
}

// todo: check if task is completed or not
function isCompleted(countingTask) {
  if (!singleTask[countingTask].classList.contains("completed")) {
    singleTask[countingTask].classList.toggle("completed");
    tasksContainer[countingTask].taskStatus = "completed";
    styleCompletedTasks(countingTask);
    hideControlsBtn(countingTask);
  } else if (singleTask[countingTask].classList.contains("completed")) {
    singleTask[countingTask].classList.toggle("completed");
    tasksContainer[countingTask].taskStatus = "open";
    styleOpenTasks(countingTask);
  }
  localStorage.setItem("tasks", JSON.stringify(tasksContainer));
}

// todo: update status
function updateTaskStatus() {
  // if task status is completed, change its style, else reset style
  for (let i = 0; i < controlsIcon.length; i++) {
    if (tasksContainer[i].taskStatus === "completed") {
      singleTask[i].classList.add("completed");
      styleCompletedTasks(i);
    } else if (tasksContainer[i].taskStatus === "open") {
      singleTask[i].classList.remove("completed");
      styleOpenTasks(i);
    }
    localStorage.setItem("tasks", JSON.stringify(tasksContainer));
  }
}
