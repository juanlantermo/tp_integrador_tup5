fetch('http://127.0.0.1:5000/historico')
  .then((response) => response.json())
  .then((data) => {
    fetch('http://127.0.0.1:5000/historico')
      .then((response) => response.json())
      .then((data) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const casas = ['oficial', 'blue', 'bolsa', 'cripto'];

        casas.forEach((casa) => {
          const currentMonthData = data.filter((item) => {
            const itemDate = new Date(item.fecha);
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear && item.casa === casa;
          });

          if (currentMonthData.length > 0) {
            const bestCompraItem = currentMonthData.reduce((prev, curr) => (curr.compra < prev.compra ? curr : prev));
            const worstCompraItem = currentMonthData.reduce((prev, curr) => (curr.compra > prev.compra ? curr : prev));
            const bestVentaItem = currentMonthData.reduce((prev, curr) => (curr.venta > prev.venta ? curr : prev));
            const worstVentaItem = currentMonthData.reduce((prev, curr) => (curr.venta < prev.venta ? curr : prev));

            document.querySelector(`.grid-${casa}-may-cot-1 .date`).textContent = formatDate(bestCompraItem.fecha);
            document.querySelector(`.grid-${casa}-may-cot-1 .precio`).textContent = `$${bestCompraItem.compra}`;

            document.querySelector(`.grid-${casa}-may-cot-2 .date`).textContent = formatDate(worstCompraItem.fecha);
            document.querySelector(`.grid-${casa}-may-cot-2 .precio`).textContent = `$${worstCompraItem.compra}`;

            document.querySelector(`.grid-${casa}-may-pro .date`).textContent = formatDate(bestVentaItem.fecha);
            document.querySelector(`.grid-${casa}-may-pro .precio`).textContent = `$${bestVentaItem.venta}`;

            document.querySelector(`.grid-${casa}-p-pro .date`).textContent = formatDate(worstVentaItem.fecha);
            document.querySelector(`.grid-${casa}-p-pro .precio`).textContent = `$${worstVentaItem.venta}`;
          }
        });
        function formatDate(dateString) {
          const date = new Date(dateString);
          const options = { weekday: 'short', day: 'numeric', month: 'long' };
          return date.toLocaleDateString('es-ES', options);
        }
      })
      .catch((error) => console.error('Error al obtener los datos:', error));

    const casas = ['oficial', 'blue', 'bolsa', 'cripto'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    casas.forEach((casa) => {
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.fecha);
        return item.casa === casa && itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear; 
      });

      const xValues = [];
      const compraValues = [];
      const ventaValues = [];

      filteredData.forEach((item) => {
        xValues.push(new Date(item.fecha).toLocaleDateString());
        compraValues.push(item.compra);
        ventaValues.push(item.venta);
      });

      createChart(casa, xValues, compraValues, ventaValues);
    });

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
