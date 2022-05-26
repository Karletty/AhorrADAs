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
                for (let i = 0; i < filtered.length; i++) {
                    if (filtered[i][0] !== e[0] || filtered[i][1] !== e[1]) {
                        filtered.push(e);
                        return;
                    }
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
    return { spent: spents, gain: gains }
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
    return { spent: spents, gain: gains }
}

const PutTotMonths = () => {
    const dTotMonth = $$('d-tot-mes');
    const table = document.createElement('table');
    let rows = '';
    table.setAttribute('class', 'table');
    for (let i = 0; i < months.length; i++) {
        rows += `
            <tr>
                <td>${monthsName[i]}</td>
                <td class='gain'>+$${monthsGain[i]}</td>
                <td class='spent'>-$${monthsSpent[i]}</td>
                <td>$${monthsGain[i] - monthsSpent[i]}</td>
            </tr>`;
    }
    table.innerHTML = `
    <thead>
        <tr>
            <th scope='col' class='fw-bold'>Mes</th>
            <th scope='col' class='fw-bold'>Ganancias</th>
            <th scope='col' class='fw-bold'>Gastos</th>
            <th scope='col' class='fw-bold'>Balance</th>
        </tr>
    </thead>
    <tbody>
        ${rows}
    </tbody>`;

    dTotMonth.appendChild(table);
}

const PutTotCategories = () => {
    const dTotCat = $$('d-tot-cats');
    const table = document.createElement('table');
    let rows = '';
    table.setAttribute('class', 'table');
    for (let i = 0; i < categoriesName.length; i++) {
        rows += `
        <tr>
            <td>${categoriesName[i]}</td>
            <td class='gain'>+$${categoriesGain[i]}</td>
            <td class='spent'>-$${categoriesSpent[i]}</td>
            <td>$${categoriesGain[i] - categoriesSpent[i]}</td>
        </tr>`;
    }
    table.innerHTML = `
    <thead>
        <tr>
            <th scope='col' class='fw-bold'>Categoría</th>
            <th scope='col' class='fw-bold'>Ganancias</th>
            <th scope='col' class='fw-bold'>Gastos</th>
            <th scope='col' class='fw-bold'>Balance</th>
        </tr>
    </thead>
    <tbody>
        ${rows}
    </tbody>`;

    dTotCat.appendChild(table);
}

const CreateRow = (description, data) => {
    let txt = `
        <div class='row margin-bottom-25'>
            <div class='col fw-bold'>${description}</div>
            <div class='col text-end'>${data[0]}</div>
            <div class='col ${data[2]} text-end'>${data[2] === 'spent' ? '-' : data[2] === 'gain' ? '+' : ''}$${data[1]}</div>
        </div>`;
    return txt;
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
    div.innerHTML += CreateRow('Categoría con mayor ganancia', GetHighestEarningCat());
    div.innerHTML += CreateRow('Categoría con mayor gasto', GetHighestSpendingCat());
    div.innerHTML += CreateRow('Categoría con mayor balance', GetHighestBalanceCat());
    div.innerHTML += CreateRow('Mes con mayor ganancia', GetHighestEarningMonth());
    div.innerHTML += CreateRow('Mes con mayor gasto', GetHighestSpendingMonth());
    dResume.appendChild(div);
}

if (GetLocalStorage()) {
    if (GetLocalStorage().ops.length > 2) {
        ChangeVisibility(dNoReport, 'add');
        ChangeVisibility(dReports, 'remove');
        operations = GetLocalStorage().ops
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
            GetLocalStorage().cats.forEach((category) => {
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
