function generateRandomId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

const ENUM_TYPE = {
    NEW: 'new',
    EDIT: 'edit',
    DELETE: 'delete',
    COMPLETE: 'complete'
}
const localItem = 'Todo_user';
const listTasks = document.querySelector(".todo-list");

window.onload = () => {
    const Todo_user = localStorage.getItem(localItem);
    if (!Todo_user) {
        localStorage.setItem(localItem,'{}');
    }
    const todoData = JSON.parse(Todo_user);
    const fragment = document.createDocumentFragment();
    for (const index in todoData) {
        let itemTask = renderTask(index, todoData[index]);
        if (todoData[index].completed) {
            itemTask.classList.add("completed");
        }
        fragment.appendChild(itemTask);
    }
    listTasks.appendChild(fragment);
    showItemsLeft();
    showSelectAll();
    showFooter();
    showClearCompleted();
};

//Render task
const renderTask = (index, taskValue) => {
    let innerTask = document.createElement("li");
    innerTask.classList.add("task");
    innerTask.classList.add("view");
    innerTask.setAttribute("id",index);
    innerTask.innerHTML = `
        <img alt="" onclick="onComplete(this)">
        <label ondblclick="editTask(this)">${taskValue.text}</label>
        <button class="delete" onclick="onDelete(this)"><i class="fa-solid fa-x"></i></button>
        <input type="text" style="display: none">        
    `;
    return innerTask;
}

//Create new task
const createNewTask = (index, taskValue) => {
    let innerTask = renderTask(index, taskValue);
    const btnSelected = document.querySelector("button.selected");
    if (btnSelected.value === 'completed') {
        innerTask.style.display = 'none';
    }
    listTasks.appendChild(innerTask);
};

//Thêm mới, cập nhật task vào local storage
const newTaskInput = document.querySelector("header input");
newTaskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (newTaskInput.value.trim() === '') {
            alert("Vui lòng nhập công việc");
            newTaskInput.value = "";
            return;
        }
        const taskId = generateRandomId(10);
        updateStorage(taskId, newTaskInput.value.trim(), ENUM_TYPE.NEW);
        createNewTask(taskId, {text: `${newTaskInput.value.trim()}`, completed: false});
        newTaskInput.value = "";
        showFooter();
        showItemsLeft();
        showSelectAll();
    }
});

//Delete, Complete, Edit, New task ở Local Storage
const updateStorage = (index, text, type) => {
    const Todo_user = localStorage.getItem(localItem);
    const todoData = JSON.parse(Todo_user);
    switch(type) {
        case ENUM_TYPE.DELETE: //Xóa Task
            delete todoData[index];
            break;
        case ENUM_TYPE.COMPLETE: //Complete Task
            todoData[index].completed = (todoData[index].completed) ? false : true;
            break;
        case ENUM_TYPE.NEW: //New Task
            todoData[index] = {text: text, completed: false};
            break;
        case ENUM_TYPE.EDIT: //Edit Task
            todoData[index].text = text;
            break;
    }
    localStorage.setItem(localItem, JSON.stringify(todoData));
};

//Show item left
function showItemsLeft() {
    const itemsLeft = document.querySelector(".todo-count");
    const tasksInComplete = document.querySelectorAll('.task:not(.completed)');
    itemsLeft.innerText = (tasksInComplete.length < 2) ? `${tasksInComplete.length} item left` : `${tasksInComplete.length} items left`;
}

//Show Clear Completed
function showClearCompleted() {
    const clearBtn = document.querySelector(".clear-completed");
    const tasksCompleted = document.querySelectorAll(".task.completed");
    clearBtn.style.display = (tasksCompleted.length) ? 'inline-block' : 'none';
}

//Show footer
function showFooter() {
    const footer = document.querySelector(".footer");
    const tasks = document.querySelectorAll(".task");
    footer.style.display = (!tasks.length) ? 'none' : 'block';
}

//Show Select All và in đậm
function showSelectAll() {
    const tasks = document.querySelectorAll(".task");
    const tasksCompleted = document.querySelectorAll(".task.completed");
    const tasksInComplete = document.querySelectorAll('.task:not(.completed)');
    const btnSelected = document.querySelector("button.selected");
    const label = document.querySelector('label[htmlfor="toggle-all"]');
    if (tasks.length === 0) {
        label.style.display = "none";
    } else {
        switch(btnSelected.value) {
            case "all":
                label.style.display = "flex";
                break;
            case "completed":
                label.style.display = (tasksCompleted.length === 0) ? 'none' : 'flex';
                break;
            case "incomplete":
                label.style.display = (tasksInComplete.length === 0) ? 'none' : 'flex';
                break;
        }
    }
    (tasksInComplete.length === 0) ? label.classList.add("active") : label.classList.remove("active");
}

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
                task.style.display = (task.classList.contains("completed")) ? 'flex' : 'none';
                break;
            case "incomplete":
                btnSelected.classList.remove("selected");
                e.classList.add("selected");
                task.style.display = (!task.classList.contains("completed")) ? 'flex' : 'none';
                break;
        }
    });
    showSelectAll();
}

//Select All
function selectAll() {
    const tasks = document.querySelectorAll(".task");
    const tasksInComplete = document.querySelectorAll('.task:not(.completed)');
    if (tasksInComplete.length === 0) {
        tasks.forEach(function(task) {
            task.classList.remove("completed");
            updateStorage(task.id, '', ENUM_TYPE.COMPLETE);
        });
    } else {
        tasksInComplete.forEach(function(taskInComplete) {
            taskInComplete.classList.add("completed");
            updateStorage(taskInComplete.id, '', ENUM_TYPE.COMPLETE);
        });
    }
    const btnSelected = document.querySelector("button.selected");
    filterTodo(btnSelected);
    showClearCompleted();
    showItemsLeft();
    showSelectAll();

}

//Click Complete task
function onComplete(e) {
    const taskId = e.parentElement.id;
    updateStorage(taskId, '', ENUM_TYPE.COMPLETE);
    const btnSelected = document.querySelector("button.selected");
    e.parentElement.classList.toggle("completed");
    switch(btnSelected.value) {
        case "completed":
            e.parentElement.style.display = (e.parentElement.classList.contains("completed")) ? 'flex' : 'none';
            break;
        case "incomplete":
            e.parentElement.style.display = (!e.parentElement.classList.contains("completed")) ? 'flex' : 'none';
            break;
    }
    showItemsLeft();
    showSelectAll();
    showClearCompleted();
}

//Click Delete task
function onDelete(e) {
    const taskId = e.parentElement.id;
    const taskDelete = document.querySelector(`#${taskId}`);
    taskDelete.parentNode.removeChild(taskDelete);
    updateStorage(taskId, '', ENUM_TYPE.DELETE);
    showItemsLeft();
    showSelectAll();
    showFooter();
    showClearCompleted();
}

//Click Clear Completed
function clearCompleted(e) {
    const tasksCompleted = document.querySelectorAll(".task.completed");
    tasksCompleted.forEach(function(taskCompleted) {
        updateStorage(taskCompleted.id, '', ENUM_TYPE.DELETE);
        taskCompleted.parentNode.removeChild(taskCompleted);
    });
    e.style.display = 'none';
    showItemsLeft();
    showSelectAll();
    showFooter();
}

//Edit task
function editTask(element) {
    element.parentElement.classList.remove("view");
    element.parentElement.querySelector("img").style.display = "none";
    const inputElement = element.parentElement.querySelector("input");
    inputElement.style.display = "inline-block";
    inputElement.focus();
    inputElement.value = element.textContent;
    element.style.display = "none";
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            showTaskAgain(element, inputElement);
        }
        if (event.key === 'Enter') {
            if (inputElement.value.trim() === '') {
                alert("Vui lòng nhập công việc");
            } else {
                showTaskAgain(element, inputElement);
                element.innerText = inputElement.value.trim();
                updateStorage(element.parentElement.id, inputElement.value.trim(), ENUM_TYPE.EDIT);
            }
        }
    });
    inputElement.addEventListener('blur', function() {
        showTaskAgain(element, inputElement);
    });
}

//Show task sau khi chỉnh sửa
function showTaskAgain(e, inputElement) {
    e.parentElement.querySelector("img").style.display = "block";
    e.style.display = "block";
    inputElement.style.display = "none";
    e.parentElement.classList.add("view");
}
