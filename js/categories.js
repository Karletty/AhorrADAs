const btnCategory = $$("btn-category");
const btnAddCategory = $(".btn-add-category");

btnCategory.classList.add("selected");


const editCategory = id => {
    const sCategory = $$("s-category");
    const sEditC = $$("s-edit-category");
    const inputName = $$("edit-category-name");
    const btnEdit = sEditC.querySelector("#btn-accept-edit");
    const btnCancel = sEditC.querySelector("#btn-cancel-edit");
    let data = getLocalStorage()
    let categories = data.cats;

    sCategory.classList.add("d-none");
    sEditC.classList.remove("d-none");

    inputName.value = categories.find(item => item.id === id).name;

    btnCancel.addEventListener("click", () => {
        sCategory.classList.remove("d-none");
        sEditC.classList.add("d-none");
    });

    btnEdit.addEventListener("click", () => {
        if(inputName.value !== ""){
                console.log("Hola")
            categories.map ((item) =>{
                if (item.id === id){
                    console.log(item.name)
                    item.name = inputName.value;
                    console.log(item.name, inputName.value);
                    return item
                }
            });
            saveLocalStorage(getLocalStorage().ops, categories)
            RefreshCategories();
            sCategory.classList.remove("d-none");
            sEditC.classList.add("d-none");
        }
    });

}

const deleteCategory = id => {
    let data = getLocalStorage()
    let categories = data.cats;
    categories = categories.filter(item => item.id !== id)
    saveLocalStorage(data.ops, categories);
    RefreshCategories();
}

const RefreshCategories = () => {
    const divCategories = $$("d-categories");
    divCategories.innerHTML = ""
    const categories = getLocalStorage().cats;
    if (categories.length > 0) {
        categories.forEach(category => {
            const divCategory = document.createElement('div');
            divCategory.setAttribute("class", "d-flex justify-content-between flex-row margin-top-25 margin-bottom-25 align-items-center");
            divCategory.innerHTML = `
            <div class="">
                <p class="color-main">${category.name}</p>
            </div>
            <div>
                <button type="button" class="btn-edit">Editar</button>
                <button type="button" class="btn-delete">Eliminar</button>
            </div>
            `;

            divCategory.querySelector(".btn-edit").addEventListener("click", () => {
                editCategory(category.id);
            });

            divCategory.querySelector(".btn-delete").addEventListener("click", () => {
                deleteCategory(category.id)
            });

            divCategories.appendChild(divCategory)
        });
    }
}

const AddCategory = name => {
    let category = new Category(nanoid(), name);
    let categories = [];
    let operations = [];
    if (getLocalStorage() !== null) {
        categories = getLocalStorage().cats;
        operations = getLocalStorage().ops;
    }
    categories.push(category);
    saveLocalStorage(operations, categories);
    RefreshCategories();
}

btnAddCategory.addEventListener("click", () => {
    const categoryName = $("#category-name");
    const name = categoryName.value
    if (name.length !== 0) {
        AddCategory(name);
        categoryName.value = "";
    }
});

if (!getLocalStorage()) {
    AddCategory("Comida");
    AddCategory("Servicios");
    AddCategory("Salidas");
    AddCategory("Educación");
    AddCategory("Transporte");
    AddCategory("Trabajo")
}

RefreshCategories()