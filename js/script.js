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

const CreateNav = () => {
    const body = $('body');
    const nav = `
    <nav class='navbar navbar-expand-lg bg-main' id='navbar'>
        <div class='container-fluid d-flex justify-content-between'>
            <a class='navbar-brand title d-flex flex-row align-items-center' href='#'>
                <img src='images/billetera.png' alt='billetera' class='header-img'>
                <h1 class='title'>AhorrADAs</h1>
            </a>
            <button class='navbar-toggler' type='button' data-bs-toggle='collapse'
                data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false'
                aria-label='Toggle navigation'>
                <img src='images/lista.png' alt='' class='header-img'>
            </button>
        </div>
            <div class='collapse navbar-collapse w-100' id='navbarSupportedContent'>
                <ul class='navbar-nav mb-2 mb-lg-0'>
                    <li class='nav-item'>
                        <a href='index.html' class='btn-aqua nav-btn' id='btn-balance'>
                            <i class='fa-solid fa-chart-line icon'></i>Balance
                        </a>
                    </li>
                    <li class='nav-item'>
                        <a href='category.html' class='btn-aqua nav-btn' id='btn-category'>
                            <i class='fa-solid fa-tag icon'></i>Categorías
                        </a>
                    </li>
                    <li class='nav-item'>
                        <a href='report.html' class='btn-aqua nav-btn' id='btn-report'><i
                                class='fa-solid fa-chart-pie icon'></i>Reportes</a>
                    </li>
                </ul>
            </div>
    </nav>`;
    body.innerHTML = nav + body.innerHTML;
}

const SaveLocalStorage = (ops, cats) => {
    localStorage.setItem('data', JSON.stringify({ ops, cats }));
}

const GetLocalStorage = () => {
    let data = JSON.parse(localStorage.getItem('data'));
    return data;
}

const GetCategory = (id) => {
    let categories = GetLocalStorage().cats;
    let name = '';
    if (categories.length > 0) {
        categories.forEach(category => {
            if (category.id === id) {
                name = category.name;
            }
        });
        return name;
    }
}

const GetBalance = operations => {
    let spents = 0;
    let gains = 0;

    operations.forEach(operation => {
        if (operation.type === 'spent') {
            spents += Number(operation.cantity);
        }
        else {
            gains += Number(operation.cantity);
        }
    });
    return { spent: spents, gain: gains }
}

const ChangeFormat = (date, join, number) => {
    if (typeof (date) === 'object') {
        const day = (`0${date.getDate()}`).slice(-2);
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const year = date.getFullYear();
        if (number === 2) {
            return [year, month, day].join(join);
        }
        else {
            return [day, month, year].join(join)
        }
    }
    else {
        date = date.split('-');
        return new Date(Number(date[0]), Number(date[1] - 1), Number(date[2]));;
    }
}

const AddCategory = name => {
    let category = new Category(nanoid(), name);
    let categories = [];
    let operations = [];
    if (GetLocalStorage() !== null) {
        categories = GetLocalStorage().cats;
        operations = GetLocalStorage().ops;
    }
    categories.push(category);
    SaveLocalStorage(operations, categories);
}

const ChangeVisibility = (element, state) => {
    if (state === 'toggle') {
        element.classList.toggle('d-none');
    }
    if (state === 'remove') {
        element.classList.remove('d-none')
    }
    if (state == 'add') {
        element.classList.add('d-none');
    }
}

if (!GetLocalStorage()) {
    AddCategory('Comida');
    AddCategory('Servicios');
    AddCategory('Salidas');
    AddCategory('Educación');
    AddCategory('Transporte');
    AddCategory('Trabajo');
}
CreateNav();