import {obtenerInventarioAPI, obtenerCategoriasAPI} from '../services/inventarioService.js';
/*
==============================================
    Grafico de Inventario por Categoria
==============================================
*/
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

/*
==============================================
    Grafico de Barras: 5 Items con Menor Stock
==============================================
*/
async function renderLowStockBarChart() {
    // Obtén todos los items del inventario
    const items = await obtenerInventarioAPI();

    // Ordena los items por stock_actual ascendente y toma los 5 con menos stock
    const lowStockItems = items
        .filter(item => typeof item.stock_actual === 'number')
        .sort((a, b) => a.stock_actual - b.stock_actual)
        .slice(0, 5);

    // Prepara los datos para el gráfico
    const labels = lowStockItems.map(item => item.nombre || item.descripcion || `ID ${item.id}`);
    const stockActualData = lowStockItems.map(item => item.stock_actual);
    const stockMinimoData = lowStockItems.map(item => item.alerta);

    // Renderiza el gráfico de barras agrupadas
    const ctx = document.getElementById('lowStockBarChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Stock Actual',
                    data: stockActualData,
                    backgroundColor: 'rgba(220, 38, 38, 0.8)', // rojo
                },
                {
                    label: 'Stock Mínimo',
                    data: stockMinimoData,
                    backgroundColor: 'rgba(128, 128, 128, 0.7)', // gris
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'bottom' },
                title: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad' }
                },
                x: {
                    title: { display: true, text: 'Item' }
                }
            }
        }
    });
}

renderLowStockBarChart();

/*
==============================================
    Grafico de Barras Horizontal: 10 Productos con Mayor Valor Total
==============================================
*/
async function renderTopValueBarChart() {
    // Obtén todos los items del inventario
    const items = await obtenerInventarioAPI();

    // Calcula el valor total de cada producto
    const itemsWithValue = items.map(item => ({
        nombre: item.nombre || item.descripcion || `ID ${item.id}`,
        valorTotal: (item.precio_unitario || 0) * (item.stock_actual || 0)
    }));

    // Ordena por valor total descendente y toma los 10 primeros
    const topItems = itemsWithValue
        .sort((a, b) => b.valorTotal - a.valorTotal)
        .slice(0, 10);

    // Prepara los datos para el gráfico
    const labels = topItems.map(item => item.nombre);
    const data = topItems.map(item => item.valorTotal);

    // Color azul claro para todas las barras
    const backgroundColors = labels.map(() => 'rgba(59, 130, 246, 0.7)');

    // Renderiza el gráfico de barras horizontal
    const ctx = document.getElementById('topValueBarChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Valor Total',
                data,
                backgroundColor: backgroundColors,
            }]
        },
        options: {
            indexAxis: 'y', // barras horizontales
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Valor Total ($)' }
                },
                y: {
                    title: { display: true, text: 'Producto' }
                }
            }
        }
    });
}

renderTopValueBarChart();
i