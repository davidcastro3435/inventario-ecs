import {obtenerInventarioAPI, obtenerCategoriasAPI} from '../services/inventarioService.js';

async function renderInventoryCategoryChart() {
    // Obtén todos los items y categorías
    const items = await obtenerInventarioAPI();
    const categories = await obtenerCategoriasAPI();

    // Mapea IDs de categoría a nombres
    const categoryIdToName = {};
    categories.forEach(cat => {
        categoryIdToName[cat.id] = cat.nombre;
    });

    // Inicializa el conteo por nombre de categoría
    const categoryCounts = {};
    categories.forEach(cat => categoryCounts[cat.nombre] = 0);

    // Cuenta los items por categoría usando el ID
    items.forEach(item => {
        const catId = item.categoriaId || item.categoria; // Usa el campo correcto
        const catName = categoryIdToName[catId];
        if (catName) {
            categoryCounts[catName]++;
        }
    });

    // Prepara datos para Chart.js
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    // Genera colores distintos para cada categoría
    const backgroundColors = labels.map((_, i) => 
        `hsl(${(i * 360 / labels.length)}, 70%, 60%)`
    );

    // Renderiza el gráfico de dona
    const ctx = document.getElementById('inventoryCategoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: false
                }
            }
        }
    });
}

renderInventoryCategoryChart();