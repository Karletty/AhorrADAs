const body = document.querySelector("body");
const navBtns = document.querySelectorAll(".nav-btn");
const sectionBalance = document.getElementById("s-balance");
const sectionCategory = document.getElementById("s-category");
const sectionReport = document.getElementById("s-report");

const sections = [sectionBalance, sectionCategory, sectionReport];


class Operation {
    constructor(id, des, cant, type, cat, date) {
        this.id = id;
        this.description = des;
        this.cantity = cant;
        this.type = type;
        this.category = cat;
        this.date = date;
    }
}
class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const saveLocalStorage = (data) => {
    localStorage.setItem("data", data);
}

const getLocalStorage = () => {
    let data = JSON.parse(localStorage.getItem("data"));
    return data;
}

const changeSection = pos => {
    for (let i = 0; i < sections.length; i++) {
        if(i === pos){
            sections[i].classList.remove("d-none");
            navBtns[i].classList.add("selected");
        }
        else{
            sections[i].classList.add("d-none");
            navBtns[i].classList.remove("selected");
        }
    }
}

for (let i = 0; i < navBtns.length; i++) {
    navBtns[i].addEventListener("click", () => {
        changeSection(i);
    });
}

changeSection(0)
