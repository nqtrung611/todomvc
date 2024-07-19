const newTaskInput = document.querySelector("header input");
const listTasks = document.querySelector(".todo-list");
let deleteTasks, editTasks, tasks;
let count;

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
    let tasks = Object.keys(localStorage);
    tasks = tasks.sort(function(a, b){return a-b});

    for (let key of tasks) {
        //Lấy tất cả giá trị trong local storage
        let value = localStorage.getItem(key);
        let innerTask = document.createElement("li");
        innerTask.classList.add("task");
        innerTask.setAttribute("id", key);
        innerTask.innerHTML = `
            <div class="view">
                <img src="./images/unchecked.png" alt="">
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
            // parent.remove();
            // count -= 1;
        });
    });

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
    const clearBtn = document.querySelector(".clear-completed");
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
    });

    tasks.forEach((element) => {
        element.addEventListener('mouseover', function() {
            element.querySelector(".destroy").style.display = "inline-block";
        });
        element.addEventListener('mouseleave', function() {
            element.querySelector(".destroy").style.display = "none";
        });
    });

    if (!tasks.length) {
        document.querySelector(".footer").style.display = "none";
    }

    const itemsLeft = document.querySelector(".todo-count strong");
    const itemsCompleted = document.querySelectorAll(".task.completed");
    itemsLeft.innerText = `${tasks.length - itemsCompleted.length}`;
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
filterOption.addEventListener("click", filterTodo);
const btnOptions = document.querySelectorAll(".btn-option");

function filterTodo(e) {
    e.preventDefault();
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
}
