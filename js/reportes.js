const btnBalance = $$('btn-report');
const dNoReport = $$('d-no-report');
const dReports = $$('d-report')
let operations;
let months;
let categories;
let categoriesName;
let categoriesSpent;
let categoriesGain;
let monthsName;
let monthsSpent;
let monthsGain;

const RemoveRepetition = (array, type) => {
    if (type === 1) {
        return array.filter((e, i) => {
            return array.indexOf(e) === i;
        });
    }
    else {
        let filtered = [];
        array.forEach(e => {
            if (filtered.length > 0) {
                let isInArray = false;
                for (let i = 0; i < filtered.length; i++) {
                    if (filtered[i][0] === e[0] && filtered[i][1] === e[1]) {
                        isInArray = true;
                        break;
                    }
                }
                if (!isInArray) {
                    filtered.push(e);
                }
            }
            else {
                filtered.push(e);
            }
        });
        return filtered;
    }
}

btnBalance.classList.add('selected');

const GetCategoryBalance = id => {
    let spents = 0;
    let gains = 0;

    operations.forEach(operation => {
        if (operation.category === id) {
            if (operation.type === 'spent') {
                spents += Number(operation.cantity);
            }
            else {
                gains += Number(operation.cantity);
            }
        }
    });
    return { spent: Math.round(spents * 100) / 100, gain: Math.round(gains * 100) / 100 }
}

const GetMonthBalance = ([month, year]) => {
    let spents = 0;
    let gains = 0;
    operations.forEach(operation => {
        let date = ChangeFormat(operation.date);
        if (date.getMonth() === month && date.getFullYear() === year) {
            if (operation.type === 'spent') {
                spents += Number(operation.cantity);
            }
            else {
                gains += Number(operation.cantity);
            }
        }
    });
    return { spent: Math.round(spents * 100) / 100, gain: Math.round(gains * 100) / 100 }
}

const CreateTableRows = ({ names, spents, gains }, tBody) => {
    for (let i = 0; i < names.length; i++) {
        let row = document.createElement('tr');
        let values = [names[i], `+$${gains[i]}`, `-$${spents[i]}`, `$${gains[i] - spents[i]}`];
        values.forEach((value, i) => {
            let cell = document.createElement('td');
            cell.appendChild(document.createTextNode(value));
            i === 1 ? cell.classList.add('gain') : i === 2 ? cell.classList.add('spent') : '';
            row.appendChild(cell);
        });
        tBody.appendChild(row)
    }
}

const PutTotMonths = () => {
    const table = $$('table-tot-mes');
    const tBody = table.querySelector('tbody');
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    CreateTableRows({ names: monthsName, spents: monthsSpent, gains: monthsGain }, tBody);
}

const PutTotCategories = () => {
    const table = $$('table-tot-cats');
    const tBody = table.querySelector('tbody');
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    CreateTableRows({ names: categoriesName, spents: categoriesSpent, gains: categoriesGain }, tBody);
}

const CreateRow = (description, data) => {
    let divRow = document.createElement('div');
    divRow.classList.add('row', 'margin-bottom-25', 'w-100');
    let values = [description, data[0], `${data[2] === 'spent' ? '-' : data[2] === 'gain' ? '+' : ''}$${data[1]}`];
    let classes = ['col fw-bold', 'col text-center', `col text-end ${data[2]}`];
    values.forEach((value, i) => {
        let divElement = document.createElement('div');
        divElement.setAttribute('class', classes[i]);
        divElement.appendChild(document.createTextNode(value));
        divRow.appendChild(divElement);
    })
    return divRow;
}

const GetHighest = (array, names, type) => {
    let mayor = array[0];
    let posMayor = 0;
    array.forEach((cant, i) => {
        if (cant > mayor) {
            mayor = cant;
            posMayor = i;
        }
    })
    return [names[posMayor], mayor, type];

}

const GetHighestEarningCat = () => {
    return (GetHighest(categoriesGain, categoriesName, 'gain'));
}

const GetHighestSpendingCat = () => {
    return GetHighest(categoriesSpent, categoriesName, 'spent');
}

const GetHighestBalanceCat = () => {
    let categoriesBalance = categoriesGain.map((gain, i) => {
        return gain - categoriesSpent[i];
    });
    return GetHighest(categoriesBalance, categoriesName, 'balance');
}

const GetHighestEarningMonth = () => {
    return GetHighest(monthsGain, monthsName, 'gain');
}

const GetHighestSpendingMonth = () => {
    return GetHighest(monthsSpent, monthsName, 'spent');
}

const PutResume = () => {
    const dResume = $$('d-resume');
    const div = document.createElement('div');
    div.setAttribute('class', 'container w-100');
    let txtArray = ['Categoría con mayor ganancia', 'Categoría con mayor gasto', 'Categoría con mayor balance', 'Mes con mayor ganancia', 'Mes con mayor gasto'];
    let valueArray = [GetHighestEarningCat(), GetHighestSpendingCat(), GetHighestBalanceCat(), GetHighestEarningMonth(), GetHighestSpendingMonth()];
    txtArray.forEach((txt, i) => {
        div.append(CreateRow(txt, valueArray[i]))
    })
    dResume.appendChild(div);
}

if (GetLocalStorage()) {
    if (GetLocalStorage().operations.length > 2) {
        ChangeVisibility(dNoReport, 'add');
        ChangeVisibility(dReports, 'remove');
        operations = GetLocalStorage().operations
        months = operations.map(op => {
            let date = ChangeFormat(op.date);
            return [date.getMonth(), date.getFullYear()];
        });
        categories = operations.map(op => {
            return op.category;
        });

        categories = RemoveRepetition(categories, 1);
        months = RemoveRepetition(months, 2);
        categoriesName = categories.map(cat => {
            let name = ''
            GetLocalStorage().categories.forEach((category) => {
                if (cat == category.id) {
                    name = category.name;
                }
            })
            return name;
        });
        categoriesSpent = categories.map(cat =>
            GetCategoryBalance(cat).spent);
        categoriesGain = categories.map(cat =>
            GetCategoryBalance(cat).gain);
        monthsName = months.map(month => {
            let date = new Date(month[1], month[0], 1);
            let name = date.toLocaleString('default', { month: 'long' });
            return `${name}/${month[1]}`;
        });
        monthsSpent = months.map(month =>
            GetMonthBalance(month).spent);
        monthsGain = months.map(month =>
            GetMonthBalance(month).gain);
        PutResume();
        PutTotCategories();
        PutTotMonths();
    }
    else {
        ChangeVisibility(dNoReport, 'remove');
        ChangeVisibility(dReports, 'add');
    }
}
