const SetData = (labels, spents, gains, title) => {
    const dataCategory = {
        labels: labels,
        datasets: [{
            label: 'Gastos',
            data: spents,
            backgroundColor: '#ef476e'
        },
        {
            label: 'Ganancias',
            data: gains,
            backgroundColor: '#06d6a0'
        }]
    }

    const configCategory = {
        type: 'bar',
        data: dataCategory,
        options: {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            },
        },
    };
    return configCategory;
}

const CreateCategoriesChart = () => {
    const chartCategories = new Chart($$('category-balance'), SetData(categoriesName, categoriesSpent, categoriesGain, 'Balance por categorías'));
};

const CreateMonthsChart = () => {
    const chartMonth = new Chart($$('month-balance'), SetData(monthsName, monthsSpent, monthsGain, 'Balance por mes'))
}
CreateMonthsChart();
CreateCategoriesChart()