const crearHeader = () => {
    const body = document.querySelector("body");
    const header = `
        <header class="header d-flex flex-row align-items-center  justify-content-between">
            <div class="d-flex flex-row align-items-center">
                <img src="images/billetera.png" alt="billetera" class="header-img">
                <h1 class="title">AhorrADAs</h1>
            </div>
            <div class="d-flex flex-row align-items-center">
                <div class="d-flex flex-row align-items-center">
                    <a href="index.html" class="btn-aqua nav-btn" id="btn-balance"><i
                            class="fa-solid fa-chart-line icon"></i>Balance</a>
                    <a href="category.html" class="btn-aqua nav-btn" id="btn-category"><i
                            class="fa-solid fa-tag icon"></i>Categorías</a>
                    <a href="report.html" class="btn-aqua nav-btn" id="btn-report"><i
                            class="fa-solid fa-chart-pie icon"></i>Reportes</a>
                </div>
                <img src="images/lista.png" alt="menú" class="header-img cursor d-none" id="nav">
            </div>
        </header>`;
    body.innerHTML = header + body.innerHTML;
}

crearHeader()

const sectionBalance = document.getElementById("s-balance");
const sectionCategory = document.getElementById("s-category");
const sectionReport = document.getElementById("s-report");

const navBtns = document.querySelectorAll(".nav-btn");
const operaciones = [];
const categorias = [];

const data = { operaciones, categorias };

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