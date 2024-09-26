fetch("https://dolarapi.com/v1/cotizaciones")
  .then(response => response.json())
  .then(data => {
    data.forEach(cotizacion => {
      if (cotizacion.moneda === "USD" && cotizacion.casa === "oficial") {
        actualizarCotizacion(".dolar-oficial", cotizacion.compra.toFixed(2), cotizacion.venta.toFixed(2));
      } else if (cotizacion.moneda === "USD" && cotizacion.casa.toLowerCase() === "blue") {
        actualizarCotizacion(".dolar-blue", cotizacion.compra.toFixed(2), cotizacion.venta.toFixed(2));
      } else if (cotizacion.moneda === "EUR" && cotizacion.casa === "oficial") {
        actualizarCotizacion(".euro", cotizacion.compra.toFixed(2), cotizacion.venta.toFixed(2));
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));

function actualizarCotizacion(selector, compra, venta) {
  const card = document.querySelector(selector);
  if (card) {
    card.querySelector(".precio-compra").textContent = `Compra ${compra}`;
    card.querySelector(".precio-venta").textContent = `Venta ${venta}`;
  }
}




  /*
  fetch("https://dolarapi.com/v1/dolares")
  .then(response => response.json())
  .then(data => {
    data.forEach(cotizacion => {
     if (cotizacion.moneda === "USD" && cotizacion.casa === "blue"  && cotizacion.nombre === "Blue"

      ) {
        // Aseguramos que el valor de "casa" sea "blue" en minúsculas
        actualizarCotizacion(".dolar-blue", cotizacion.venta);
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error)); */


