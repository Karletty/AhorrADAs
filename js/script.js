const $ = el => document.querySelector(el);
const $$ = el => document.getElementById(el);

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

const createNav = () => {
    const body = $("body");
    const nav = `
    <nav class="navbar navbar-expand-lg bg-main" id="navbar">
        <div class="container-fluid d-flex justify-content-between">
            <a class="navbar-brand title d-flex flex-row align-items-center" href="#">
                <img src="images/billetera.png" alt="billetera" class="header-img">
                <h1 class="title">AhorrADAs</h1>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <img src="images/lista.png" alt="" class="header-img">
            </button>
        </div>
            <div class="collapse navbar-collapse w-100" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a href="index.html" class="btn-aqua nav-btn" id="btn-balance">
                            <i class="fa-solid fa-chart-line icon"></i>Balance
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="category.html" class="btn-aqua nav-btn" id="btn-category">
                            <i class="fa-solid fa-tag icon"></i>Categorías
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="report.html" class="btn-aqua nav-btn" id="btn-report"><i
                                class="fa-solid fa-chart-pie icon"></i>Reportes</a>
                    </li>
                </ul>
            </div>
    </nav>`;
    body.innerHTML = nav + body.innerHTML;
}

createNav();

const saveLocalStorage = (ops, cats) => {
    localStorage.setItem("data", JSON.stringify({ ops, cats }));
}

const getLocalStorage = (cat, op) => {
    let data = JSON.parse(localStorage.getItem("data"));
    return data;
}