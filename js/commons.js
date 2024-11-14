let fecha = document.getElementById("fecha");
let valorCompraDolarOficial = document.getElementById("compra-oficial");
let valorVentaDolarOficial = document.getElementById("venta-oficial");
let respuesta;

fetch('http://127.0.0.1:5000/dolares')
  .then((response) => response.json())
  .then((data) => {
    respuesta = data;

    const fechaAPI = new Date(data[0].fechaActualizacion);

    const opcionesFecha = {
      weekday: "short",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const fechaFormateada = fechaAPI.toLocaleDateString("es-ES", opcionesFecha);
    fecha.innerText = fechaFormateada;
  })
  .catch((error) => {
    console.error(error);
  });