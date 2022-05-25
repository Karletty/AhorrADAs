const btnHideFilters = $$('hide-filters');
const filtersContainer = $$('filters');
const btnBalance = $$('btn-balance');
const btnChangeWindows = $$('btn-change-add');
const btnAddOp = $$('btn-add-operation');
const btnCancelAdd = $$('btn-cancel-add-op');

btnBalance.classList.add('selected');

const CleanInputs = () => {
    const inputDescription = $$('input-description');
    const inputCant = $$('input-cant');
    const inputDate = $$('input-date');
    let today = new Date();

    inputCant.value = 0;
    inputDescription.value = '';
    today = ChangeFormat(today, '-', 2);
    inputDate.value = today;

}

const ChangeWindows = (type) => {
    const titleAdd = $$('h2-add-operation');
    const titleEdit = $$('h2-edit-operation');
    const btnAdd = $$('btn-add-operation');
    const btnEdit = $$('btn-edit-operation');
    const sectionBalanceOp = $$('s-balance');
    const sectionAddOp = $$('s-add-operation');

    ChangeVisibility(sectionAddOp, 'toggle');
    ChangeVisibility(sectionBalanceOp, 'toggle');
    if (type === 1) {
        ChangeVisibility(titleAdd, 'remove');
        ChangeVisibility(titleEdit, 'add');
        ChangeVisibility(btnAdd, 'remove');
        ChangeVisibility(btnEdit, 'add');
        CleanInputs();
    }
    if (type === 2) {
        ChangeVisibility(titleAdd, 'add');
        ChangeVisibility(titleEdit, 'remove');
        ChangeVisibility(btnAdd, 'add');
        ChangeVisibility(btnEdit, 'remove');
    }
}

const PutCategories = select => {
    let data = GetLocalStorage();
    data.cats.forEach(category => {
        const op = document.createElement('option');
        op.setAttribute('value', category.id);
        op.appendChild(document.createTextNode(category.name));
        select.appendChild(op);
    });
}

const AddOperation = (description, cant, type, categoryId, date) => {
    let operation = new Operation(nanoid(), description, cant, type, categoryId, date);
    let categories = [];
    let operations = [];
    if (GetLocalStorage() !== null) {
        categories = GetLocalStorage().cats;
        operations = GetLocalStorage().ops;
    }
    operations.push(operation);
    SaveLocalStorage(operations, categories);
}

const InitialOperations = () => {
    let data = GetLocalStorage();
    if (data) {
        const divNoOp = $$('d-no-operations');
        const divOps = $$('d-operations');
        if (data.ops.length > 0) {
            divNoOp.classList.add('d-none');
            divOps.classList.remove('d-none');
        }
        else {
            divNoOp.classList.remove('d-none');
            divOps.classList.add('d-none');
        }
    }
}

const ValidateInputs = (des, cant) => {
    if (des === '') {
        return false;
    }
    if (cant <= 0) {
        return false;
    }
    return true;
}

const InitialCategories = () => {
    let data = GetLocalStorage();
    if (data) {
        const selectCat = $$('select-category');
        const filterCat = $$('filter-category');
        if (data.cats.length > 0) {
            PutCategories(selectCat);
            PutCategories(filterCat);
        }
    }
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

const Start = () => {
    const filterDate = $$('filter-date');
    const inputDate = $$('input-date');
    let today = new Date();
    today = ChangeFormat(today, '-', 2);
    inputDate.value = today;
    filterDate.value = today;
    InitialCategories();
    InitialOperations();
}

const ChangeSelect = (select, value) => {
    const options = select.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            options[i].selected = true;
        }
        else {
            options[i].selected = false;
        }
    }
}

const PutInputs = id => {
    let operation = GetLocalStorage().ops.find(op => op.id === id);
    const inputDescription = $$('input-description');
    const inputCant = $$('input-cant');
    const inputDate = $$('input-date');
    const selectCategory = $$('select-category');
    const selectType = $$('select-type');

    inputDescription.value = operation.description;
    inputCant.value = operation.cantity;
    inputDate.value = operation.date;

    ChangeSelect(selectCategory, operation.category);
    ChangeSelect(selectType, operation.type);
}

const EditOperation = id => {
    const btnEditOp = $$('btn-edit-operation');
    ChangeWindows(2);
    PutInputs(id);
    let operations = GetLocalStorage().ops;
    btnEditOp.addEventListener('click', () => {
        const description = $$('input-description').value;
        const cant = $$('input-cant').value;
        if (ValidateInputs(description, cant)) {
            let type = $$('select-type');
            let category = $$('select-category');
            const date = $$('input-date').value;
            const indexType = type.selectedIndex;
            const indexCat = category.selectedIndex;
            type = type.options[indexType].value;
            category = category.options[indexCat].value;
            operations.map(op => {
                if (op.id === id) {
                    op.description = description;
                    op.cantity = cant;
                    op.type = type;
                    op.category = category;
                    op.date = date;
                    console.log(op);
                    return op;
                }
            });
            console.log(operations)
            SaveLocalStorage(operations, GetLocalStorage().cats)
            RefreshOperations();
            ChangeWindows(1);
        }
    });
}

const DeleteOperation = id => {
    let data = GetLocalStorage();
    let operations = data.ops;
    operations = operations.filter(op => op.id !== id);
    SaveLocalStorage(operations, data.cats);
    RefreshOperations();
}

const RefreshOperations = () => {
    const tBodyOps = $$('t-body-ops');
    tBodyOps.innerHTML = '';
    const operations = GetLocalStorage().ops;
    if (operations.length > 0) {
        operations.forEach(operation => {
            let date = ChangeFormat(operation.date, '/', 1);
            const tableRow = document.createElement('tr');

            tableRow.setAttribute('class', 't-row');
            date = ChangeFormat(date, '/', 1);
            tableRow.innerHTML = `
            <th>${operation.description}</th>
            <th>${GetCategory(operation.category)}</th>
            <th>${date}</th>
            <th class='${operation.type}'>${operation.type === 'spent' ? '-' : '+'}$${operation.cantity}</th>
            <th>
                <button type='button' class='btn-blue'>Editar</button>
                <button type='button' class='btn-red'>Eliminar</button>
            </th>
            `;

            const btnEdit = tableRow.querySelector('.btn-blue');
            const btnDelete = tableRow.querySelector('.btn-red');

            btnEdit.addEventListener('click', () => {
                EditOperation(operation.id);
            });

            btnDelete.addEventListener('click', () => {
                DeleteOperation(operation.id);
            });

            tBodyOps.appendChild(tableRow)
        });
    }
}

btnAddOp.addEventListener('click', () => {
    const description = $$('input-description').value;
    const cant = $$('input-cant').value;
    let type = $$('select-type');
    let category = $$('select-category');
    const date = $$('input-date').value;
    const indexType = type.selectedIndex;
    const indexCat = category.selectedIndex;
    type = type.options[indexType].value;
    category = category.options[indexCat].value;
    if (ValidateInputs(description, cant)) {
        AddOperation(description, cant, type, category, date);
        ChangeWindows(1);
        RefreshOperations();
        InitialOperations();
    }
});

btnChangeWindows.addEventListener('click', () => {
    ChangeWindows(1);
});

btnCancelAdd.addEventListener('click', () => {
    ChangeWindows(1);
});

btnHideFilters.addEventListener('click', () => {
    ChangeVisibility(filtersContainer, 'toggle');
});

Start();
RefreshOperations();