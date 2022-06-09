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
const AddOperation = (description, cant, type, categoryId, date) => {
    let operation = new Operation(nanoid(), description, cant, type, categoryId, date);
    let ops = GetLocalStorage().operations;
    ops.push(operation);
    let { gain, spent } = GetBalance(ops);
    if ((gain - spent) > 0) {
        ChangeWindows(1);
        SaveOperations(operation);
        RefreshOperations();
        InitialOperations();
    }
    else {
        const toastLiveExample = $('#msg-not-enough');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show()
    }
    let categories = [];
    let operations = [];
    if (GetLocalStorage() !== null) {
        categories = GetLocalStorage().categories;
        operations = GetLocalStorage().operations;
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

const PutInputs = (id) => {
    let operation = GetLocalStorage().operations.find(op => op.id === id);
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

const EditOperation = (id) => {
    const btnEditOp = $$('btn-edit-operation');
    ChangeWindows(2);
    PutInputs(id);
    let operations = GetLocalStorage().operations;
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
                    return op;
                }
            });
            SaveLocalStorage(operations, GetLocalStorage().categories)
            RefreshOperations();
            ChangeWindows(1);
        }
    });
}

const DeleteOperation = (id) => {
    let operations = GetLocalStorage().operations;
    operations = operations.filter(op => op.id !== id);
    SaveLocalStorage(operations, GetLocalStorage().categories);
    operations = GetLocalStorage().operations;
    RefreshOperations();
    InitialOperations();
}

const RefreshBalance = () => {
    const spanGain = $$('sp-gain');
    const spanSpent = $$('sp-spent');
    const spanTotal = $$('sp-total');
    let { gain, spent } = GetBalance(operations);
    spanGain.innerText = `+$${gain}`;
    spanSpent.innerText = `-$${spent}`;
    spanTotal.innerText = `$${gain - spent}`
}

const RefreshOperations = () => {
    operations = GetOperations();
    RefreshBalance()
    const tBodyOps = $$('t-body-ops');
    while (tBodyOps.firstChild) {
        tBodyOps.removeChild(tBodyOps.firstChild);
    }
    if (operations.length > 0) {
        operations.forEach(({ id, description, cantity, type, category, date }) => {
            date = ChangeFormat(ChangeFormat(date, '/', 1), '/', 1);
            const tableRow = document.createElement('tr');
            const values = [description, GetCategory(category), date, `${type === 'spent' ? '-' : '+'}$${Number(cantity)}`, ''];
            values.forEach((value, i) =>{
                const cell = document.createElement('td');
                if(i === 4) {
                    createBtnsActions(cell);
                }
                else{
                    if(i === 3){
                        cell.setAttribute('class', type)
                    }
                    cell.appendChild(document.createTextNode(value));
                }
                tableRow.appendChild(cell);
            })
            tableRow.setAttribute('class', 't-row');

            tableRow.querySelector('.btn-blue').addEventListener('click', () => {
                EditOperation(id);
            });

            tableRow.querySelector('.btn-red').addEventListener('click', () => {
                DeleteOperation(id);
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
    }
});

btnChangeWindows.addEventListener('click', () => {
    ChangeWindows(1);
});

btnCancelAdd.addEventListener('click', () => {
    ChangeWindows(1);
});

RefreshOperations();