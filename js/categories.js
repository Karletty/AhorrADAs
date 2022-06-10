const btnCategory = $$('btn-category');
const btnAddCategory = $('.btn-add-category');

btnCategory.classList.add('selected');


const ChangeWindows = () => {
    const sCategory = $$('s-category');
    const sEditC = $$('s-edit-category');

    ChangeVisibility(sCategory, 'toggle');
    ChangeVisibility(sEditC, 'toggle');
}

const EditCategory = id => {
    const sCategory = $$('s-category');
    const sEditC = $$('s-edit-category');
    const inputName = $$('edit-category-name');
    const btnEdit = sEditC.querySelector('#btn-accept-edit');
    const btnCancel = sEditC.querySelector('#btn-cancel-edit');
    let data = GetLocalStorage();
    let categories = data.categories;

    inputName.classList.remove('is-invalid')
    ChangeWindows();

    inputName.value = categories.find(item => item.id === id).name;

    btnCancel.addEventListener('click', () => {
        ChangeWindows();
    });

    btnEdit.addEventListener('click', () => {
        if (inputName.value !== '') {
            categories.map((item) => {
                if (item.id === id) {
                    item.name = inputName.value;
                    return item
                }
            });
            SaveLocalStorage(GetLocalStorage().operations, categories);
            RefreshCategories();
            ChangeVisibility(sCategory, 'remove');
            ChangeVisibility(sEditC, 'add');
        }
        else {
            inputName.classList.add('is-invalid')
        }
    });

}

const DeleteCategory = id => {
    let data = GetLocalStorage();
    let categories = data.categories;
    categories = categories.filter(item => item.id !== id);
    SaveLocalStorage(data.operations, categories);
    RefreshCategories();
}

const RefreshCategories = () => {
    const divCategories = $$('d-categories');
    while (divCategories.firstChild) {
        divCategories.removeChild(divCategories.firstChild);
    }
    const categories = GetLocalStorage().categories;
    if (categories.length > 0) {
        categories.forEach(({ id, name }) => {
            const divCategory = document.createElement('div');
            const divContainer = document.createElement('div');
            const divBtns = document.createElement('div');
            const catName = document.createElement('p');

            createBtnsActions(divBtns)

            divCategory.setAttribute('class', 'd-flex justify-content-between margin-top-25 margin-bottom-25 align-items-center card-hover');
            divContainer.setAttribute('class', 'd-flex align-items-center');
            catName.setAttribute('class', 'color-main');
            catName.appendChild(document.createTextNode(name));
            divContainer.appendChild(catName);
            divCategory.appendChild(divContainer);
            divCategory.appendChild(divBtns);

            divBtns.querySelector('.btn-blue').addEventListener('click', () => {
                const categoryName = $('#category-name');
                categoryName.classList.remove('is-invalid');
                EditCategory(id);
            });

            divBtns.querySelector('.btn-red').addEventListener('click', () => {
                const categoryName = $('#category-name');
                categoryName.classList.remove('is-invalid');
                DeleteCategory(id);
            });

            divCategories.appendChild(divCategory);
        });
    }
}

btnAddCategory.addEventListener('click', () => {
    const categoryName = $('#category-name');
    const name = categoryName.value;
    if (name.length !== 0) {
        categoryName.classList.remove('is-invalid');
        AddCategory(name);
        RefreshCategories();
        categoryName.value = '';
    }
    else {
        categoryName.classList.add('is-invalid');
    }
});


RefreshCategories();