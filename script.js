const newTaskInput = document.querySelector("#new-task input");
const listTasks = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let count;

//Function on window load
window.onload = () => {
    let tong = Object.keys(localStorage);
    const max = tong.length;
    tong = tong.sort(function(a, b){return a-b});
    if (max == 0) {
        count = max;
    } else {
        count = Number(tong[max-1]) + 1;
    }
    displayTasks();
};

//Hiển thị task từ local storage
const displayTasks = () => {
    if (Object.keys(localStorage).length > 0) {
        listTasks.style.display = "inline-block";
    } else {
    listTasks.style.display = "none";
    }

    //Clear the tasks
    listTasks.innerHTML = "";

    //Fetch All The Keys in local storage
    let tasks = Object.keys(localStorage);
    tasks = tasks.sort(function(a, b){return a-b});

    for (let key of tasks) {
        let classValue = "";

        //Lấy tất cả giá trị trong local storage
        let value = localStorage.getItem(key);
        let innerTask = document.createElement("div");
        innerTask.classList.add("task");
        innerTask.setAttribute("id", key);
        innerTask.innerHTML = `<span id="taskname">${value.split("_")[1]}</span>`;
        //localstorage would store boolean as string so we parse it to boolean back
        let editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        if (!JSON.parse(value.split("_")[0])) {
            editButton.style.visibility = "visible";
        } else {
            editButton.style.visibility = "hidden";
            innerTask.classList.add("completed");
        }
        innerTask.appendChild(editButton);
        innerTask.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
        innerTask.innerHTML += `<img src="./images/unchecked.png" alt="">`;
        listTasks.appendChild(innerTask);
    }

    //Completed task(Click vào task sẽ hoàn thành và ngược lại)
    tasks = document.querySelectorAll(".task");
    tasks.forEach((element, index) => {
        const btnCompleted = element.querySelector("img");
        btnCompleted.onclick = () => {
        //Cập nhật trạng thái trong local storage
            if (element.classList.contains("completed")) {
                updateStorage(element.id.split("_")[0], element.innerText, false);
            } else {
                updateStorage(element.id.split("_")[0], element.innerText, true);
            }
        };
    });

    //Cập nhật task
    editTasks = document.getElementsByClassName("edit");
    Array.from(editTasks).forEach((element, index) => {
        const textElement = element.parentElement.firstChild;
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            // disableButtons(true);
            element.innerHTML = 'Save';
            element.style.cssText = `
                background: #0bdd00;
                color: #000;
            `
            const textEdit = textElement.textContent;
            element.parentElement.querySelector(".delete").remove();
            element.parentElement.querySelector("img").remove();
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = textElement.textContent;
            textElement.parentNode.replaceChild(inputElement, textElement);
            inputElement.focus();
            inputElement.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    if (inputElement.value.trim() === '') {
                        alert("Vui lòng nhập công việc");
                        updateStorage(element.parentElement.id, textEdit, false);
                    } else {
                        updateStorage(element.parentElement.id, inputElement.value.trim(), false);
                    }
                }
            });
            element.addEventListener('click', function() {
                if (inputElement.value.trim() === '') {
                    alert("Vui lòng nhập công việc");
                    updateStorage(element.parentElement.id, textEdit, false);
                } else {
                    updateStorage(element.parentElement.id, inputElement.value.trim(), false);
                }
            });
            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    updateStorage(element.parentElement.id, textEdit, false);
                }
            });
            // inputElement.addEventListener('blur', function() {
            //     if (inputElement.value.length ==0) {
            //         alert("Vui lòng nhập công việc");
            //         updateStorage(element.parentElement.id, textEdit, false);
            //     } else {
            //         updateStorage(element.parentElement.id, inputElement.value.trim(), false);
            //     }
            //     // updateStorage(element.parentElement.id, textEdit, false);
            // });
        });
    });

    //Xóa task hiển thị và ở local storage
    deleteTasks = document.getElementsByClassName("delete");
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            //Xóa task ở local storage và xóa thẻ div hiển thị
            let parent = element.parentElement;
            removeTask(parent.id, parent.firstChild);
            // parent.remove();
            // count -= 1;
        });
    });
    const checkbtn = document.querySelector("button.active");
    tasks.forEach(function(todo) {
        switch(checkbtn.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
};

//Ẩn-hiện nút chỉnh sửa khi hoàn thành task
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

//Xóa task ở local storage
const removeTask = (taskValue, taskContent) => {
    const popup = document.createElement('div');
    popup.id = 'popup';

    const confirm_popup = document.createElement('div');
    confirm_popup.id = 'confirm_popup';
    
    const message = document.createElement('p');
    message.textContent = `Bạn có muốn xóa "${taskContent.textContent}" không?`;
    confirm_popup.appendChild(message);
    
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Có';
    yesButton.addEventListener('click', function() {
        localStorage.removeItem(taskValue);
        displayTasks();
        popup.parentNode.removeChild(popup);
    });
    confirm_popup.appendChild(yesButton);
    
    const noButton = document.createElement('button');
    noButton.textContent = 'Không';
    noButton.addEventListener('click', function() {
        popup.parentNode.removeChild(popup);
    });
    confirm_popup.appendChild(noButton);
    popup.appendChild(confirm_popup);
    document.body.appendChild(popup);
    document.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.parentNode.removeChild(popup);
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            popup.parentNode.removeChild(popup);
        }
    });
};

//Thêm task vào local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}`, `${completed}_${taskValue}`);
    displayTasks();
};

//Thêm mới, cập nhật task vào local storage
document.querySelector("#push").addEventListener("click", () => {
    //Hiện thị nút chỉnh sửa
    disableButtons(false);
    if (newTaskInput.value.trim() === '') {
        alert("Vui lòng nhập công việc");
    } else {
        updateStorage(count, newTaskInput.value.trim(), false);
        count += 1;
        newTaskInput.value = "";
    }
});


//Button select task (Tất cả, hoàn thành, chưa hoàn thành)
const filterOption = document.querySelector(".filter-todo");
filterOption.addEventListener("click", filterTodo);
const btnOptions = document.querySelectorAll(".btn-option");

function filterTodo(e) {
    e.preventDefault();
    btnOptions.forEach(function(btnOption) {
        btnOption.classList.remove("active");
    });
    const todos = listTasks.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all":
                e.target.classList.add("active");
                todo.style.display = "flex";
                break;
            case "completed":
                e.target.classList.add("active");
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                e.target.classList.add("active");
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}
