let operations = GetLocalStorage().operations;
const btnHideFilters = $$('hide-filters');
const filtersContainer = $$('filters');
const filterCat = document.getElementById('filter-category');
const filterDate = $$('filter-date');
const orderBy = $$('order-by');
const params = new URLSearchParams(location.search);
const filterType = document.getElementById('filter-type');
const paramsNames = ['type', 'category', 'since', 'order-by'];

const PutCategories = select => {
    let data = GetLocalStorage();
    data.categories.forEach(category => {
        const op = document.createElement('option');
        op.setAttribute('value', category.id);
        op.appendChild(document.createTextNode(category.name));
        select.appendChild(op);
    });
}


const InitialCategories = () => {
    let data = GetLocalStorage();
    if (data) {
        const selectCat = $$('select-category');
        if (data.categories.length > 0) {
            PutCategories(selectCat);
            PutCategories(filterCat);
        }
    }
}

const InitialOperations = () => {
    let data = GetLocalStorage();
    if (data) {
        const divNoOp = $$('d-no-operations');
        const divOps = $$('d-operations');
        if (data.operations.length > 0) {
            divNoOp.classList.add('d-none');
            divOps.classList.remove('d-none');
        }
        else {
            divNoOp.classList.remove('d-none');
            divOps.classList.add('d-none');
        }
    }
}

const EmptyParams = () => {
    let bool = false;
    paramsNames.forEach((paramName) => {
        bool = bool || params.get(paramName);
    });
    if (!bool) {
        ChangeVisibility(filtersContainer, 'add');
    }
    putParamsInFilters();
    return bool;
}

const putParamsInFilters = () => {
    filterType.value = params.get('type');
    filterCat.value = params.get('category');
    filterDate.value = params.get('since');
    orderBy.value = params.get('order-by')
}


const Start = () => {
    const inputDate = $$('input-date');
    let today = new Date();
    today = ChangeFormat(today, '-', 2);
    inputDate.value = today;
    filterDate.value = today;
    InitialCategories();
    InitialOperations();
    EmptyParams();
}
Start();

const PutParam = (name, e) => {
    params.set(name, e.target.value);
    window.location.href = `${window.location.pathname}?${params.toString()}`;
}

filterCat.addEventListener('change', (e) => {
    PutParam('category', e);
});

filterType.addEventListener('change', (e) => {
    PutParam('type', e);
});

filterDate.addEventListener('change', (e) => {
    PutParam('since', e);
})
orderBy.addEventListener('change', (e) => {
    PutParam('order-by', e)
})

const FilterParam = (paramName, operations) => {
    if (params.get(paramName)) {
        if (params.get(paramName) !== "all") {
            operations = operations.filter(op => op[paramName] === params.get(paramName));
        }
    }
    return operations
}
const OrderByParam = ([first, orderType], operations) => {
    operations = operations.sort((next, actual) => {
        let vNext = next[orderType];
        let vActual = actual[orderType];
        if (orderType !== 'description') {
            if (orderType === 'date') {
                vNext = ChangeFormat(vNext);
                vActual = ChangeFormat(vActual);
            }
            else {
                vNext = Number(vNext);
                vActual = Number(vActual);
            }
            return first === 'upward'? (vNext > vActual ? -1 : vNext < vActual ? 1 : 0) : (vNext < vActual ? -1 : vNext > vActual ? 1 : 0);
        }
        else {
            const collator = new Intl.Collator('en');
            let value = collator.compare(vNext, vActual)
            return first === 'upward'? value : value * -1 ;
        }
    });
    return operations
}

const GetOperations = () => {
    let operations = GetLocalStorage().operations;
    operations = FilterParam('type', operations);
    operations = FilterParam('category', operations);
    if (params.get('since')) {
        operations = operations.filter(({ date }) => {
            const minDate = ChangeFormat(params.get('since'), '', '');
            date = ChangeFormat(date);
            return date >= minDate;
        });
    }
    if (params.get('order-by')) {
        operations = OrderByParam(params.get('order-by').split('-'), operations);
        /*Más reciente
          Menos reciente
          Mayor monto
          Menor monto
          A/Z
          Z/A
        */
    }
    return operations;
}

btnHideFilters.addEventListener('click', () => {
    ChangeVisibility(filtersContainer, 'toggle');
    if (filtersContainer.classList.contains('d-none')) {
        window.location.href = window.location.pathname
    }
    operations = GetLocalStorage().operations;
});