const newTaskInput = document.querySelector("header input");
const listTasks = document.querySelector(".todo-list");

//Thêm mới, cập nhật task vào local storage
document.querySelector("#input-box").addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (newTaskInput.value.trim() === '') {
            alert("Vui lòng nhập công việc");
        } else {
            updateNewStorage(newTaskInput.value.trim(), false);
            createTask({text: `${newTaskInput.value.trim()}`, completed: false});
            newTaskInput.value = "";
        }
        showItemsLeft();
    }
});

//Thêm task vào local storage
const updateNewStorage = (taskValue, completed) => {
    const Todo_user = localStorage.getItem('Todo_user');
    const newTodo = {text: `${taskValue}`, completed: completed};
    const todoData = JSON.parse(Todo_user);
    todoData.push(newTodo);
    localStorage.setItem('Todo_user', JSON.stringify(todoData));
};

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

//Render từng task
const createTask = (taskValue) => {
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
                if(task.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
                break;
            case "incomplete":
                btnSelected.classList.remove("selected");
                e.classList.add("selected");
                if(!task.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
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
    if (itemsCompleted.length) {
        clearBtn.style.display = "inline-block";
    } else {
        clearBtn.style.display = "none";
    }

    const footer = document.querySelector(".footer");
    if (!tasks.length) {
        footer.style.display = "none";
    } else {
        footer.style.display = "block";
    }

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

//Delete, Complete, Edit task ở Local Storage
const updateStorage = (index, text) => {
    console.log(typeof text);
    const Todo_user = localStorage.getItem('Todo_user');
    const todoData = JSON.parse(Todo_user);
    if (typeof text === 'boolean') {
        console.log("trung");
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
        //Edit task
        todoData[index].text = text;
    }
    localStorage.setItem('Todo_user', JSON.stringify(todoData));
    showItemsLeft();
};

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
