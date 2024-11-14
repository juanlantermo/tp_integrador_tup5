fetch('http://127.0.0.1:5000/historico')
  .then((response) => response.json())
  .then((data) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const casas = ['oficial', 'blue', 'bolsa'];

    /*Obtenemos datos para tablas */
    casas.forEach((casa) => {
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.fecha);
        return item.casa === casa && itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      });

      /* Arrays para almacenar los datos del gráfico */
      const xValues = [];
      const compraValues = [];
      const ventaValues = [];

      /* Llenamos arrays previos */
      filteredData.forEach((item) => {
        xValues.push(new Date(item.fecha).toLocaleDateString());
        compraValues.push(item.compra);
        ventaValues.push(item.venta);
      });

      createChart(casa, xValues, compraValues, ventaValues);
    });

    // Funcion para crear grafico
    function createChart(casa, labels, compraData, ventaData) {
      const chartId = `chart-${casa}`;
      new Chart(chartId, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Compra',
              data: compraData,
              borderColor: 'red',
              fill: false,
            },
            {
              label: 'Venta',
              data: ventaData,
              borderColor: 'green',
              fill: false,
            },
          ],
        },
        options: {
          legend: { display: true },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  })
  .catch((error) => console.error('Error al obtener los datos:', error));
