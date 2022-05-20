const btnHideFilters = document.getElementById("hide-filters");
const filtersContainer = document.getElementById("filters");

navBtns[0].classList.add("selected");

btnHideFilters.addEventListener("click", () => {
    if (filtersContainer.classList.contains("d-none")) {
        filtersContainer.classList.remove("d-none")
    }
    else {
        filtersContainer.classList.add("d-none");
    }
});