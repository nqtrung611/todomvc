window.onload = () => {
    const Todo_user = localStorage.getItem('Todo_user');
    if (!Todo_user) {
        localStorage.setItem('Todo_user','[]');
    }
    const todoData = JSON.parse(Todo_user);
    for (let i = 0; i < todoData.length; i++) {
        renderTask(todoData[i], 'show');
    }
    showItemsLeft();
    showSelectAll();
    showFooter();
    showClearCompleted();
};

//Render 1 task
const renderTask = (taskValue, text) => {
    const listTasks = document.querySelector(".todo-list");
    let innerTask = document.createElement("li");
    innerTask.classList.add("task");
    innerTask.classList.add("view");
    innerTask.innerHTML = `
        <img alt="" onclick="onComplete(this)">
        <label ondblclick="editTask(this)">${taskValue.text}</label>
        <button class="delete" onclick="onDelete(this)"><i class="fa-solid fa-x"></i></button>
        <input type="text" style="display: none">        
    `;
    if (text === 'show') {
        if (taskValue.completed) {
            innerTask.classList.add("completed");
        }
    } else {
        const btnSelected = document.querySelector("button.selected");
        if (btnSelected.value === 'completed') {
            innerTask.style.display = 'none';
        }
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
        } else {
            updateStorage('', newTaskInput.value.trim(), ENUM_TYPE.NEW);
            renderTask({text: `${newTaskInput.value.trim()}`, completed: false}, 'new');
            newTaskInput.value = "";
            showFooter();
            showItemsLeft();
            showSelectAll();
        }
    }
});

const ENUM_TYPE = {
    NEW: 'new',
    EDIT: 'edit',
    DELETE: 'delete',
    COMPLETE: 'complete'
}

//Delete, Complete, Edit, New task ở Local Storage
const updateStorage = (index, text, type) => {
    const Todo_user = localStorage.getItem('Todo_user');
    const todoData = JSON.parse(Todo_user);
    switch(type) {
        case ENUM_TYPE.DELETE: //Xóa Task
            todoData.splice(index, 1);
            break;
        case ENUM_TYPE.COMPLETE: //Complete Task
            todoData[index].completed = (todoData[index].completed) ? false : true;
            break;
        case ENUM_TYPE.NEW: //New Task
            const newTodo = {text: `${text}`, completed: false};
            todoData.push(newTodo);
            break;
        case ENUM_TYPE.EDIT: //Edit Task
            todoData[index].text = text;
            break;
    }
    localStorage.setItem('Todo_user', JSON.stringify(todoData));
};

//Show item left
function showItemsLeft() {
    const itemsLeft = document.querySelector(".todo-count");
    const tasks = document.querySelectorAll(".task");
    const tasksCompleted = document.querySelectorAll(".task.completed");
    const countTask = tasks.length - tasksCompleted.length;
    itemsLeft.innerText = (countTask < 2) ? `${countTask} item left` : `${countTask} items left`;
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
    const btnSelected = document.querySelector("button.selected");
    const label = document.querySelector('label[htmlfor="toggle-all"]');
    const itemsLeft = document.querySelector(".todo-count");
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
                label.style.display = (itemsLeft.innerText === '0 item left') ? 'none' : 'flex';
                break;
        }
    }
    (itemsLeft.innerText === '0 item left') ? label.classList.add("active") : label.classList.remove("active");
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
    const itemsCompleted = document.querySelectorAll(".task.completed");
    if (tasks.length === itemsCompleted.length) {
        for (let i = 0; i < tasks.length; i++) {
            tasks[i].classList.remove("completed");
            updateStorage(i, '', ENUM_TYPE.COMPLETE);
        }
    } else {
        for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].classList.contains("completed")) {
                tasks[i].classList.add("completed");
                updateStorage(i, '', ENUM_TYPE.COMPLETE);
            }
        }
    }
    const btnSelected = document.querySelector("button.selected");
    filterTodo(btnSelected);
    showClearCompleted();
    showItemsLeft();
    showSelectAll();

}

//Click Complete task
function onComplete(e) {
    const tasks = document.querySelectorAll(".task");
    let index = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (e.parentElement === tasks[i]) {
            index = i;
            break;
        }
    }
    updateStorage(index, '', ENUM_TYPE.COMPLETE);
    const btnSelected = document.querySelector("button.selected");
    if (e.parentElement.classList.contains("completed")) {
        e.parentElement.classList.remove("completed");
    } else {
        e.parentElement.classList.add("completed");
    }
    switch(btnSelected.value) {
        case "all":
            break;
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
    const tasks = document.querySelectorAll(".task");
    let index = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (e.parentElement === tasks[i]) {
            index = i;
            break;
        }
    }
    tasks[index].parentNode.removeChild(tasks[index]);
    updateStorage(index, '', ENUM_TYPE.DELETE);
    showItemsLeft();
    showSelectAll();
    showFooter();
    showClearCompleted();
}

//Click Clear Completed
function clearCompleted(e) {
    const tasks = document.querySelectorAll(".task");
    const itemsCompleted = document.querySelectorAll(".task.completed");
    for (let i = itemsCompleted.length - 1; i >= 0; i--) {
        for ( let j = tasks.length - 1; j >= 0; j--) {
            if (itemsCompleted[i] === tasks[j]) {
                tasks[j].parentNode.removeChild(tasks[j]);
                updateStorage(j, '', ENUM_TYPE.DELETE);
            }
        }
    }
    e.style.display = 'none';
    showItemsLeft();
    showSelectAll();
    showFooter();
}

//Edit task
function editTask(element) {
    let index;
    const tasks = document.querySelectorAll(".task");
    for (let i = 0; i < tasks.length; i++) {
        if (element.parentElement === tasks[i]) {
            index = i;
            break;
        }
    }
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
    });
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (inputElement.value.trim() === '') {
                alert("Vui lòng nhập công việc");
            } else {
                showTaskAgain(element, inputElement);
                element.innerText = inputElement.value.trim();
                updateStorage(index, inputElement.value.trim(), ENUM_TYPE.EDIT);
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
