const btnHideFilters = $$("hide-filters");
const filtersContainer = $$("filters");
const btnBalance = $$("btn-balance");

btnBalance.classList.add("selected");

btnHideFilters.addEventListener("click", () => {
    filtersContainer.classList.toggle("d-none");
});