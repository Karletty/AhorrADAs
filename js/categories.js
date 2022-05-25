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
    let categories = data.cats;

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
            SaveLocalStorage(GetLocalStorage().ops, categories);
            RefreshCategories();
            ChangeVisibility(sCategory, 'remove');
            ChangeVisibility(sEditC, 'add');
        }
    });

}

const DeleteCategory = id => {
    let data = GetLocalStorage();
    let categories = data.cats;
    categories = categories.filter(item => item.id !== id);
    SaveLocalStorage(data.ops, categories);
    RefreshCategories();
}

const RefreshCategories = () => {
    const divCategories = $$('d-categories');
    divCategories.innerHTML = '';
    const categories = GetLocalStorage().cats;
    if (categories.length > 0) {
        categories.forEach(category => {
            const divCategory = document.createElement('div');
            divCategory.setAttribute('class', 'd-flex justify-content-between flex-row margin-top-25 margin-bottom-25 align-items-center card-hover');
            divCategory.innerHTML = `
            <div class='d-flex align-items-center'>
                <p class='color-main'>${category.name}</p>
            </div>
            <div>
                <button type='button' class='btn-blue'>Editar</button>
                <button type='button' class='btn-red'>Eliminar</button>
            </div>
            `;

            divCategory.querySelector('.btn-blue').addEventListener('click', () => {
                EditCategory(category.id);
            });

            divCategory.querySelector('.btn-red').addEventListener('click', () => {
                DeleteCategory(category.id);
            });

            divCategories.appendChild(divCategory);
        });
    }
}

btnAddCategory.addEventListener('click', () => {
    const categoryName = $('#category-name');
    const name = categoryName.value;
    if (name.length !== 0) {
        AddCategory(name);
        RefreshCategories();
        categoryName.value = '';
    }
});


RefreshCategories();