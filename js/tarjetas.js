fetch('http://127.0.0.1:5000/dolares')
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < 3; i++) {
      const dolar = data[i];
      let tarjeta = crearTarjeta(dolar);
      const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
      contenedorTarjetas.appendChild(tarjeta);
    }
  })
  .catch((error) => {
    console.error(error);
  });

fetch('http://127.0.0.1:5000/cotizaciones')
  .then((response) => response.json())
  .then((data) => {
    for (let i = 1; i < data.length; i++) {
      const dolar = data[i];
      let tarjeta = crearTarjeta(dolar);
      tarjeta.classList.add('tarjeta-otra');
      const contenedorTarjetas = document.getElementById('contenedor-tarjetas-otras');
      contenedorTarjetas.appendChild(tarjeta);
    }
  })
  .catch((error) => {
    console.error(error);
  });

function crearTarjeta(dolar) {
  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarjeta');

  const subtitulo = document.createElement('h5');
  subtitulo.classList.add('subtitulo', 'tipo-moneda');
  subtitulo.innerText = dolar.nombre;

  const tipoCompra = document.createElement('p');
  tipoCompra.classList.add('tipo-precio');
  tipoCompra.innerText = 'Compra';

  const valorCompra = document.createElement('p');
  valorCompra.id = `compra-${dolar.nombre.toLowerCase().replace(/\s/g, '-')}`;
  valorCompra.classList.add('precio');
  valorCompra.innerText = `$${dolar.compra.toFixed(2)}`;

  const tipoVenta = document.createElement('p');
  tipoVenta.classList.add('tipo-precio');
  tipoVenta.innerText = 'Venta';

  const valorVenta = document.createElement('p');
  valorVenta.id = `venta-${dolar.nombre.toLowerCase().replace(/\s/g, '-')}`;
  valorVenta.classList.add('precio');
  valorVenta.innerText = `$${dolar.venta.toFixed(2)}`;

  tarjeta.appendChild(subtitulo);
  tarjeta.appendChild(tipoCompra);
  tarjeta.appendChild(valorCompra);
  tarjeta.appendChild(tipoVenta);
  tarjeta.appendChild(valorVenta);

  return tarjeta;
}