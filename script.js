window.onload = (e) => {
    // localStorage.setItem('Todo_user','[]');
    const Todo_user = localStorage.getItem('Todo_user');
    if (!Todo_user) {
        localStorage.setItem('Todo_user','[]');
    }
    const todoData = JSON.parse(Todo_user);
    for (let i = 0; i < todoData.length; i++) {
        createTask(todoData[i]);
    }
    showItemsLeft();
};

//Thêm mới, cập nhật task vào local storage
document.querySelector("#input-box").addEventListener('keydown', (event) => {
    const newTaskInput = document.querySelector("header input");
    if (event.key === 'Enter') {
        if (newTaskInput.value.trim() === '') {
            alert("Vui lòng nhập công việc");
            newTaskInput.value = "";
        } else {
            updateStorage(newTaskInput.value.trim(), '');
            createTask({text: `${newTaskInput.value.trim()}`, completed: false});
            newTaskInput.value = "";
        }
        showItemsLeft();
    }
});

//Delete, Complete, Edit, New task ở Local Storage
const updateStorage = (index, text) => {
    const Todo_user = localStorage.getItem('Todo_user');
    const todoData = JSON.parse(Todo_user);
    if (typeof text === 'boolean') {
        if (text) {
            //Complete task
            if (todoData[index].completed) {
                todoData[index].completed = false;
            } else {
                todoData[index].completed = true;
            }
        } else {
            //Xóa task
            todoData.splice(index, 1);
        }
    } else {
        if (text === '') {
            //New Task
            const newTodo = {text: `${index}`, completed: false};
            todoData.push(newTodo);
        } else {
            //Edit task
            todoData[index].text = text;
        }
    }
    localStorage.setItem('Todo_user', JSON.stringify(todoData));
    showItemsLeft();
};

//Render từng task
const createTask = (taskValue) => {
    const listTasks = document.querySelector(".todo-list");
    let innerTask = document.createElement("li");
    innerTask.classList.add("task");
    innerTask.classList.add("view");
    innerTask.innerHTML = `
        <img alt="" onclick="complete_delete(this)">
        <label ondblclick="editTask(this)">${taskValue.text}</label>
        <button class="delete" onclick="complete_delete(this)"><i class="fa-solid fa-x"></i></button>
        <input type="text" style="display: none">        
    `;
    if (taskValue.completed) {
        innerTask.classList.add("completed");
    }
    listTasks.appendChild(innerTask);
    showItemsLeft();
};

//Button select task (Tất cả, hoàn thành, chưa hoàn thành)
function filterTodo(e) {
    const tasks = document.querySelectorAll(".task");
    const btnSelected = document.querySelector("button.selected");
    tasks.forEach(function(task) {
        switch(e.value) {
            case "all":
                btnSelected.classList.remove("selected");
                e.classList.add("selected");
                task.style.display = "flex";
                break;
            case "completed":
                btnSelected.classList.remove("selected");
                e.classList.add("selected");
                (task.classList.contains("completed")) ? `${task.style.display = "flex"}` : `${task.style.display = "none"}`;
                break;
            case "incomplete":
                btnSelected.classList.remove("selected");
                e.classList.add("selected");
                (!task.classList.contains("completed")) ? `${task.style.display = "flex"}` : `${task.style.display = "none"}`;
                break;
        }
    });
    showItemsLeft();
}

//Show items left, Clear Completed, Footer, Select All
function showItemsLeft() {
    const itemsLeft = document.querySelector(".todo-count span");
    const tasks = document.querySelectorAll(".task");
    const itemsCompleted = document.querySelectorAll(".task.completed");
    if ((tasks.length - itemsCompleted.length) < 2) {
        itemsLeft.innerText = `${tasks.length - itemsCompleted.length} item`;
    } else {
        itemsLeft.innerText = `${tasks.length - itemsCompleted.length} items`;
    }

    const clearBtn = document.querySelector(".clear-completed");
    (itemsCompleted.length) ? `${clearBtn.style.display = "inline-block"}` : `${clearBtn.style.display = "none"}`;

    const footer = document.querySelector(".footer");
    (!tasks.length) ? `${footer.style.display = "none"}` : `${footer.style.display = "block"}`;

    const btnSelectAll = document.querySelector(".toggle-all");
    const btnSelected = document.querySelector("button.selected");
    if (tasks.length === 0) {
        btnSelectAll.parentElement.lastElementChild.style.display = "none";
    } else {
        switch(btnSelected.value) {
            case "all":
                btnSelectAll.parentElement.lastElementChild.style.display = "flex";
                break;
            case "completed":
                if (itemsCompleted.length === 0) {
                    btnSelectAll.parentElement.lastElementChild.style.display = "none";
                } else {
                    btnSelectAll.parentElement.lastElementChild.style.display = "flex";
                }
                break;
            case "incomplete":
                if (itemsLeft.innerText === '0 item') {
                    btnSelectAll.parentElement.lastElementChild.style.display = "none";
                } else {
                    btnSelectAll.parentElement.lastElementChild.style.display = "flex";
                }
                break;
        }
    }
    if (itemsLeft.innerText === '0 item') {
        btnSelectAll.parentElement.lastElementChild.classList.add("active");
    } else {
        btnSelectAll.parentElement.lastElementChild.classList.remove("active");
    }
}


//Click Complete_Delete task
function complete_delete(e) {
    const tasks = document.querySelectorAll(".task");
    let index = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (e.parentElement === tasks[i]) {
            index = i;
        }
    }
    if (e.tagName === 'IMG') {
        if (e.parentElement.classList.contains("completed")) {
            e.parentElement.classList.remove("completed");
            updateStorage(index, true);
        } else {
            e.parentElement.classList.add("completed");
            updateStorage(index, true);
        }
    } else {
        tasks[index].parentNode.removeChild(tasks[index]);
        updateStorage(index, false);
    }
    const btnSelected = document.querySelector("button.selected");
    filterTodo(btnSelected);
}

//Clear Completed
function clearCompleted() {
    const tasks = document.querySelectorAll(".task");
    const itemsCompleted = document.querySelectorAll(".task.completed");
    for (let i = itemsCompleted.length - 1; i >= 0; i--) {
        for ( let j = tasks.length - 1; j >= 0; j--) {
            if (itemsCompleted[i] === tasks[j]) {
                tasks[j].parentNode.removeChild(tasks[j]);
                updateStorage(j, false);
            }
        }
    }
}

//Select All
function selectAll() {
    const tasks = document.querySelectorAll(".task");
    const itemsCompleted = document.querySelectorAll(".task.completed");
    if (tasks.length === itemsCompleted.length) {
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].classList.remove("completed");
            updateStorage(i, true);
        }
    } else {
        for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].classList.contains("completed")) {
                tasks[i].classList.add("completed");
                updateStorage(i, true);
            }
        }
    }
}

//Edit task
function editTask(element) {
    let index;
    const tasks = document.querySelectorAll(".task");
    for (let i = 0; i < tasks.length; i++) {
        if (element.parentElement === tasks[i]) {
            index = i;
        }
    }
    const textEdit = element.textContent;
    element.parentElement.classList.remove("view");
    element.parentElement.querySelector("img").style.display = "none";
    const inputElement = element.parentElement.querySelector("input");
    inputElement.style.display = "inline-block";
    inputElement.focus();
    inputElement.value = element.textContent;
    element.style.display = "none";
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            element.parentElement.querySelector("img").style.display = "block";
            element.style.display = "block";
            inputElement.style.display = "none";
            element.parentElement.classList.add("view");
        }
    });
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (inputElement.value.trim() === '') {
                alert("Vui lòng nhập công việc");
            } else {
                element.parentElement.querySelector("img").style.display = "block";
                element.style.display = "block";
                element.innerText = inputElement.value.trim();
                inputElement.style.display = "none";
                updateStorage(index, inputElement.value.trim());
                element.parentElement.classList.add("view");
            }
        }
    });
    inputElement.addEventListener('blur', function() {
        element.parentElement.querySelector("img").style.display = "block";
        element.style.display = "block";
        inputElement.style.display = "none";
        element.parentElement.classList.add("view");
    });
}




// window.onload = (e) => {
//     const Todo_user = localStorage.getItem('Todo_user');
//     if (!Todo_user) {
//         localStorage.setItem('Todo_user','[]');
//     }
//     const todoData = JSON.parse(Todo_user);
//     for (let i = 0; i < todoData.length; i++) {
//         renderTask(todoData[i]);
//     }
//     showItemsLeft();
//     showSelectAll();
//     showFooter();
//     showClearCompleted();
// };

// //Render 1 task
// const renderTask = (taskValue) => {
//     const listTasks = document.querySelector(".todo-list");
//     let innerTask = document.createElement("li");
//     innerTask.classList.add("task");
//     innerTask.classList.add("view");
//     innerTask.innerHTML = `
//         <img alt="" onclick="onComplete(this)">
//         <label ondblclick="editTask(this)">${taskValue.text}</label>
//         <button class="delete" onclick="onDelete(this)"><i class="fa-solid fa-x"></i></button>
//         <input type="text" style="display: none">        
//     `;
//     if (taskValue.completed) {
//         innerTask.classList.add("completed");
//     }
//     listTasks.appendChild(innerTask);
//     // showItemsLeft();
// };

// //Thêm mới, cập nhật task vào local storage
// const newTaskInput = document.querySelector("header input");
// newTaskInput.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//         if (newTaskInput.value.trim() === '') {
//             alert("Vui lòng nhập công việc");
//             newTaskInput.value = "";
//         } else {
//             updateStorage(newTaskInput.value.trim(), '');
//             renderTask({text: `${newTaskInput.value.trim()}`, completed: false});
//             newTaskInput.value = "";
//         }
//         // showItemsLeft();
//     }
// });

// //Delete, Complete, Edit, New task ở Local Storage
// const updateStorage = (value, text) => {
//     const Todo_user = localStorage.getItem('Todo_user');
//     const todoData = JSON.parse(Todo_user);
//     switch(text) {
//         case false: //Xóa Task
//             todoData.splice(value, 1);
//             break;
//         case true: //Complete Task
//             todoData[value].completed = (todoData[value].completed) ? false : true;
//             break;
//         case '': //New Task
//             const newTodo = {text: `${value}`, completed: false};
//             todoData.push(newTodo);
//             break;
//         default: //Edit Task
//             todoData[value].text = text;
//             break;
//     }
    
//     localStorage.setItem('Todo_user', JSON.stringify(todoData));
//     // showItemsLeft();
// };

// //Show item left
// function showItemsLeft() {
//     const itemsLeft = document.querySelector(".todo-count");
//     const tasks = document.querySelectorAll(".task");
//     const tasksCompleted = document.querySelectorAll(".task.completed");
//     const countTask = tasks.length - tasksCompleted.length;
//     itemsLeft.innerText = (countTask < 2) ? `${countTask} item left` : `${countTask} items left`;
// }

// //Show Clear Completed
// function showClearCompleted() {
//     const clearBtn = document.querySelector(".clear-completed");
//     const tasksCompleted = document.querySelectorAll(".task.completed");
//     clearBtn.style.display = (tasksCompleted.length) ? 'inline-block' : 'none';
// }

// //Show footer
// function showFooter() {
//     const footer = document.querySelector(".footer");
//     const tasks = document.querySelectorAll(".task");
//     footer.style.display = (!tasks.length) ? 'none' : 'block';
// }

// //Show Select All và in đậm
// function showSelectAll() {
//     const tasks = document.querySelectorAll(".task");
//     const btnSelected = document.querySelector("button.selected");
//     const label = document.querySelector('label[htmlfor="toggle-all"]');
//     const itemsLeft = document.querySelector(".todo-count");
//     if (tasks.length === 0) {
//         label.style.display = "none";
//     } else {
//         switch(btnSelected.value) {
//             case "all":
//                 label.style.display = "flex";
//                 break;
//             case "completed":
//                 label.style.display = (itemsCompleted.length === 0) ? 'none' : 'flex';
//                 break;
//             case "incomplete":
//                 label.style.display = (itemsLeft.innerText === '0 item left') ? 'none' : 'flex';
//                 break;
//         }
//     }
//     (itemsLeft.innerText === '0 item left') ? label.classList.add("active") : label.classList.remove("active");
// }

// //Button select task (Tất cả, hoàn thành, chưa hoàn thành)
// function filterTodo(e) {
//     const tasks = document.querySelectorAll(".task");
//     const btnSelected = document.querySelector("button.selected");
//     tasks.forEach(function(task) {
//         switch(e.value) {
//             case "all":
//                 btnSelected.classList.remove("selected");
//                 e.classList.add("selected");
//                 task.style.display = "flex";
//                 break;
//             case "completed":
//                 btnSelected.classList.remove("selected");
//                 e.classList.add("selected");
//                 task.style.display = (task.classList.contains("completed")) ? 'flex' : 'none';
//                 // (task.classList.contains("completed")) ? `${task.style.display = "flex"}` : `${task.style.display = "none"}`;
//                 break;
//             case "incomplete":
//                 btnSelected.classList.remove("selected");
//                 e.classList.add("selected");
//                 task.style.display = (!task.classList.contains("completed")) ? 'flex' : 'none';
//                 // (!task.classList.contains("completed")) ? `${task.style.display = "flex"}` : `${task.style.display = "none"}`;
//                 break;
//         }
//     });
// }

// //Select All
// function selectAll() {
//     const tasks = document.querySelectorAll(".task");
//     const itemsCompleted = document.querySelectorAll(".task.completed");
//     if (tasks.length === itemsCompleted.length) {
//         for (let i = 0; i < tasks.length; i++) {
//             tasks[i].classList.remove("completed");
//             updateStorage(i, true);
//         }
//     } else {
//         for (let i = 0; i < tasks.length; i++) {
//             if (!tasks[i].classList.contains("completed")) {
//                 tasks[i].classList.add("completed");
//                 updateStorage(i, true);
//             }
//         }
//     }
//     showClearCompleted();
//     showItemsLeft();
//     showSelectAll();
// }

// //Click Complete task
// function onComplete(e) {
//     const tasks = document.querySelectorAll(".task");
//     let index = 0;
//     for (let i = 0; i < tasks.length; i++) {
//         if (e.parentElement === tasks[i]) {
//             index = i;
//         }
//     }
//     updateStorage(index, true);
//     if (e.parentElement.classList.contains("completed")) {
//         e.parentElement.classList.remove("completed");
//     } else {
//         e.parentElement.classList.add("completed");
//     }
// }

// //Click Delete task
// function onDelete(e) {
//     const tasks = document.querySelectorAll(".task");
//     let index = 0;
//     for (let i = 0; i < tasks.length; i++) {
//         if (e.parentElement === tasks[i]) {
//             index = i;
//         }
//     }
//     tasks[index].parentNode.removeChild(tasks[index]);
//     updateStorage(index, false);
// }