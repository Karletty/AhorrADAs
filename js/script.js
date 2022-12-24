const $ = el => document.querySelector(el);
const $$ = el => document.getElementById(el);

class Operation {
    constructor(id, des, cant, type, cat, date) {
        this.id = id;
        this.description = des;
        this.cantity = Math.round(cant * 100) / 100;
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
const SaveOperations = newOperation => {
    SaveData(newOperation, 'operations');
}

const SaveCategory = newCategory => {
    SaveData(newCategory, 'categories');
}

const SaveData = (newData, type) => {
    let data = GetLocalStorage();
    data[type].push(newData);
    localStorage.setItem('data', JSON.stringify({ operations: data.operations, categories: data.categories }))
}

const SaveLocalStorage = (operations, categories) => {
    localStorage.setItem('data', JSON.stringify({ operations, categories }));
}

const GetLocalStorage = () => {
    let data = JSON.parse(localStorage.getItem('data'));
    return data;
}

const GetCategory = (id) => {
    let categories = GetLocalStorage().categories;
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

    operations.forEach(({ type, cantity }) => {
        if (type === 'spent') {
            spents += Number(cantity);
        }
        else {
            gains += Number(cantity);
        }
    });
    return { spent: Math.round(spents * 100) / 100, gain: Math.round(gains * 100) / 100 }
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
        SaveCategory(category);
    }
    else {
        SaveLocalStorage(operations, [...categories, category]);
    }
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

const createBtnsActions = container => {
    const btnEdit = document.createElement('button');
    const btnDelete = document.createElement('button');
    btnEdit.setAttribute('class', 'btn-blue');
    btnDelete.setAttribute('class', 'btn-red');
    btnEdit.appendChild(document.createTextNode('Editar'));
    btnDelete.appendChild(document.createTextNode('Eliminar'));
    container.appendChild(btnEdit);
    container.appendChild(btnDelete);
}


if (!GetLocalStorage()) {
    AddCategory('Comida');
    AddCategory('Servicios');
    AddCategory('Salidas');
    AddCategory('Educación');
    AddCategory('Transporte');
    AddCategory('Trabajo');
}
