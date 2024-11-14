let fecha = document.getElementById("fecha");

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