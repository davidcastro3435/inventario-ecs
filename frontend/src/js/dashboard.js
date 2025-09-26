import {obtenerInventarioAPI, obtenerCategoriasAPI, obtenerStockMensualAPI} from '../services/inventarioService.js';

const inventario = await obtenerInventarioAPI();
const categorias = await obtenerCategoriasAPI();

/*
==============================================
    Cuadro de valor total inventario
==============================================
*/

async function mostrarValorTotalInventario() {
    try {
        // Llamada al API para obtener todo el inventario
        let total = 0;
        for (const item of inventario) {
            total += (item.stock_actual || 0) * (item.precio_unitario || 0);
        }
        // Mostrar el resultado en el cuadro
        const valorBox = document.getElementById('valor-total-inventario');
        if (valorBox) {
            valorBox.textContent = total.toLocaleString('es-ES', { style: 'currency', currency: 'CRC' });
        }
    } catch (error) {
        console.error('Error al calcular el valor total del inventario:', error);
    }
}

// Ejecutar al cargar el dashboard
mostrarValorTotalInventario();

/*
==============================================
    Cuadro de valor promedio inventario
==============================================
*/

async function mostrarValorPromedioInventario() {
    try {
        let suma = 0;
        let totalItems = inventario.length;
        for (const item of inventario) {
            suma += (parseFloat(item.precio_unitario) || 0);
        }
        let promedio = totalItems > 0 ? suma / totalItems : 0;
        const promedioRedondeado = promedio.toFixed(2);
        // Mostrar el resultado en el cuadro
        const valorBox = document.getElementById('valor-promedio-inventario');
        if (valorBox) {
            valorBox.textContent = promedioRedondeado.toLocaleString('es-ES', { style: 'currency', currency: 'CRC' });
        }
    } catch (error) {
        console.error('Error al calcular el valor promedio del inventario:', error);
    }
}

// Ejecutar al cargar el dashboard
mostrarValorPromedioInventario();

/*
==============================================
    Grafico de Barras: Valor total inventario por categoría
==============================================
*/

/*
==============================================
    Grafico de valor total inventario mensual
==============================================
*/

async function renderStockMensualLineChart() {
    try {
        const stockMensual = await obtenerStockMensualAPI();
        console.log('Datos de stock mensual:', stockMensual);
        // Procesar datos: obtener mes y stock
        // Suponiendo que stockMensual tiene campos: fecha (YYYY-MM-DD) y stock
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const labels = stockMensual.map(reg => {
            const date = new Date(reg.fecha);
            return meses[date.getMonth()];
        });
        const data = stockMensual.map(reg => reg.stock_total);
        const ctx = document.getElementById('stockMensualLineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Stock Mensual',
                    data,
                    borderColor: '#1B3C53',
                    backgroundColor: 'rgba(27,60,83,0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Stock Mensual'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Stock' }
                    },
                    x: {
                        title: { display: true, text: 'Mes' }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al renderizar el gráfico de stock mensual:', error);
    }
}

renderStockMensualLineChart();

/*
==============================================
    Grafico de Inventario por Categoria
==============================================
*/

async function renderInventoryCategoryChart() {
    // Inicializa el contador por Id_categoria
    const countsByCategoryId = {};
    categorias.forEach(cat => {
        countsByCategoryId[cat.id_categoria] = 0;
    });

    // Cuenta los items por Id_categoria
    inventario.forEach(item => {
        if (countsByCategoryId.hasOwnProperty(item.id_categoria)) {
            countsByCategoryId[item.id_categoria]++;
        }
    });

    // Prepara los datos para el gráfico
    const labels = [];
    const data = [];
    categorias.forEach(cat => {
        labels.push(cat.nombre);
        data.push(countsByCategoryId[cat.id_categoria]);
    });

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
                legend: { position: 'bottom' },
                title: {
                    display: true,
                    text: 'Proporción de Inventario por Categoría'
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

    // Ordena los items por stock_actual ascendente y toma los 5 con menos stock
    const lowStockItems = inventario
        .filter(item => typeof item.stock_actual === 'number')
        .sort((a, b) => a.stock_actual - b.stock_actual)
        .slice(0, 5);

    // Prepara los datos para el gráfico
    const MAX_LABEL_LENGTH = 15;
    const labels = lowStockItems.map(item => {
        const nombre = item.nombre || item.descripcion || `ID ${item.id}`;
        return nombre.length > MAX_LABEL_LENGTH
            ? nombre.slice(0, MAX_LABEL_LENGTH) + '...'
            : nombre;
    });
    const stockActualData = lowStockItems.map(item => item.stock_actual);
    const stockMinimoData = lowStockItems.map(item => item.alarma);


    
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
    // Calcula el valor total de cada producto
    const itemsWithValue = inventario.map(item => ({
        nombre: item.nombre || item.descripcion || `ID ${item.id}`,
        valorTotal: (item.precio_unitario || 0) * (item.stock_actual || 0)
    }));

    // Ordena por valor total descendente y toma los 10 primeros
    const topItems = itemsWithValue
        .sort((a, b) => b.valorTotal - a.valorTotal)
        .slice(0, 10);

    // Prepara los datos para el gráfico
    const MAX_LABEL_LENGTH = 15;
    const labels = topItems.map(item =>
        item.nombre.length > MAX_LABEL_LENGTH
            ? item.nombre.slice(0, MAX_LABEL_LENGTH) + '...'
            : item.nombre
    );
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