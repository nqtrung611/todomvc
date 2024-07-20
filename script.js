const newTaskInput = document.querySelector("header input");
const listTasks = document.querySelector(".todo-list");
let deleteTasks, editTasks, tasks;
let count;
const btnSelectAll = document.querySelector(".toggle-all");

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
        listTasks.style.display = "block";
    } else {
        listTasks.style.display = "none";
    }

    //Clear the tasks
    listTasks.innerHTML = "";

    //Fetch All The Keys in local storage
    let listKeys = Object.keys(localStorage);
    listKeys = listKeys.sort(function(a, b){return a-b});


    //Show tất cả các task đã được lưu trong localStorage
    for (let key of listKeys) {
        //Lấy tất cả giá trị trong local storage
        let value = localStorage.getItem(key);
        let innerTask = document.createElement("li");
        innerTask.classList.add("task");
        innerTask.setAttribute("id", key);
        innerTask.innerHTML = `
            <div class="view">
                <img alt="">
                <label>${value.split("_")[1]}</label>
                <button class="destroy"><i class="fa-solid fa-x"></i></button>
            </div>
        `;
        if (!JSON.parse(value.split("_")[0])) {
            null
        } else {
            innerTask.classList.add("completed");
        }
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
    
    //Xóa task hiển thị và ở local storage
    deleteTasks = document.getElementsByClassName("destroy");
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            //Xóa task ở local storage và xóa thẻ div hiển thị
            let parent = element.parentElement.parentElement;
            removeTask(parent.id);
        });
    });

    //Giữ tab trạng thái select mỗi khi hàm displayTasks được gọi lại
    const checkbtn = document.querySelector("button.selected");
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

    //Hover ẩn hiện nút xóa
    tasks.forEach((task) => {
        const btnDestroy = task.querySelector(".destroy");
        task.addEventListener('mouseover', function() {
            if (btnDestroy) {
                btnDestroy.style.display = "inline-block";
            }
        });
        task.addEventListener('mouseleave', function() {
            if (btnDestroy) {
                btnDestroy.style.display = "none";
            }
        });
    });

    //Ẩn hiện footer
    if (!tasks.length) {
        document.querySelector(".footer").style.display = "none";
    }

    //Hiện số task chưa hoàn thành
    const itemsLeft = document.querySelector(".todo-count strong");
    const itemsCompleted = document.querySelectorAll(".task.completed");
    itemsLeft.innerText = `${tasks.length - itemsCompleted.length}`;

    //Ẩn hiện nút Clear Completed
    const clearBtn = document.querySelector(".clear-completed");
    if (itemsCompleted.length) {
        clearBtn.style.display = "inline-block";
    } else {
        clearBtn.style.display = "none";
    }

    //Click "Clear Completed" để xóa các task đã hoàn thành
    clearBtn.addEventListener('click', function() {
        let max = Object.keys(localStorage);
        for (let key of max) {
            let value = localStorage.getItem(key);
            if (!JSON.parse(value.split("_")[0])) {
                null;
            } else {
                removeTask(key);
            }
        }
        // if (itemsLeft.textContent === '0') {
        //     btnSelectAll.parentElement.lastElementChild.style.display = "none";
        // } else {
        //     btnSelectAll.parentElement.lastElementChild.style.display = "flex";
        // }
    });

    //Ẩn, hiện, in đậm nút Select All
    if (tasks.length === 0) {
        btnSelectAll.parentElement.lastElementChild.style.display = "none";
    } else {
        switch(checkbtn.value) {
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
                if (itemsLeft.innerText === '0') {
                    btnSelectAll.parentElement.lastElementChild.style.display = "none";
                } else {
                    btnSelectAll.parentElement.lastElementChild.style.display = "flex";
                }
                break;
        }
        if (itemsLeft.innerText === '0') {
            btnSelectAll.parentElement.lastElementChild.classList.add("active");
        } else {
            btnSelectAll.parentElement.lastElementChild.classList.remove("active");
        }
    }

    //Edit Task
    tasks.forEach(function(task) {
        task.addEventListener('dblclick', function(e) {
            const textElement = task.querySelector("label");
            const textEdit = textElement.textContent;
            task.querySelector(".destroy").remove();
            task.querySelector("img").remove();
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.setAttribute('class', 'editing');
            inputElement.value = textElement.textContent;
            textElement.parentNode.replaceChild(inputElement, textElement);
            inputElement.focus();
            let taskStatus = false;
            if (task.classList.contains("completed")) {
                taskStatus = true;
            }
            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    updateStorage(task.id, textEdit, taskStatus);
                }
            });
            inputElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    if (inputElement.value.trim() === '') {
                        alert("Vui lòng nhập công việc");
                        updateStorage(task.id, textEdit, taskStatus);
                    } else {
                        updateStorage(task.id, inputElement.value.trim(), taskStatus);
                    }
                }
            });
            inputElement.addEventListener('blur', function() {
                inputElement.remove();
                displayTasks();
            });
        });
    });
};

//Xóa task ở local storage
const removeTask = (taskValue) => {
    localStorage.removeItem(taskValue);
    displayTasks();
};

//Thêm task vào local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}`, `${completed}_${taskValue}`);
    displayTasks();
};

//Thêm mới, cập nhật task vào local storage
document.querySelector("#push").addEventListener("click", () => {
    if (newTaskInput.value.trim() === '') {
        alert("Vui lòng nhập công việc");
    } else {
        updateStorage(count, newTaskInput.value.trim(), false);
        count += 1;
        newTaskInput.value = "";
    }
});

//Button select task (Tất cả, hoàn thành, chưa hoàn thành)
const filterOption = document.querySelector(".filters");
filterOption.addEventListener('click', filterTodo);
const btnOptions = document.querySelectorAll(".btn-option");

function filterTodo(e) {
    // e.preventDefault();
    const todos = listTasks.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all":
                btnOptions.forEach(function(btnOption) {
                    btnOption.classList.remove("selected");
                });
                e.target.classList.add("selected");
                todo.style.display = "flex";
                break;
            case "completed":
                btnOptions.forEach(function(btnOption) {
                    btnOption.classList.remove("selected");
                });
                e.target.classList.add("selected");
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                btnOptions.forEach(function(btnOption) {
                    btnOption.classList.remove("selected");
                });
                e.target.classList.add("selected");
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
    displayTasks();
}

//Click Select All
btnSelectAll.addEventListener('click', function() {
    const itemsLeft = document.querySelector(".todo-count strong");
    const todos = listTasks.childNodes;
    if (itemsLeft.innerText === '0') {
        todos.forEach(function(todo) {
            todo.classList.remove("completed");
            localStorage.setItem(`${todo.id}`, `false_${todo.innerText}`);
        });
    } else {
        todos.forEach(function(todo) {
            if (!todo.classList.contains("completed")) {
                todo.classList.add("completed");
                localStorage.setItem(`${todo.id}`, `true_${todo.innerText}`);
            }
        });
    }
    displayTasks();
});
