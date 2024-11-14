/* Trae informacion para enviar cotizaciones en el mail */
fetch('http://127.0.0.1:5000/dolares')
  .then((response) => response.json())
  .then((data) => {
    const resumenDiv = document.getElementById('cotizaciones');

    const resumenHTML = data
      .map((item) => {
        const { nombre, compra, venta } = item;
        return `
            <div>
                <h4>${nombre}</h4>
                <p>Compra: ${compra}</p>
                <p>Venta: ${venta}</p>
            </div>  
        `;
      })
      .join('');
    resumenDiv.innerHTML = resumenHTML;
  })
  .catch((error) => {
    console.error('Error al obtener los datos:', error);
  });


/* Llena datos formulario para envio de mail */  
const form = document.getElementById('contacto');

form.addEventListener('submit', async function (event) {
  event.preventDefault(); // evito envio por defecto

  const nombre = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const mensaje = document.getElementById('message').value;
  const cotizaciones = Array.from(document.querySelectorAll('#cotizaciones div'))
    .map((div) => {
      const nombre = div.querySelector('h4').textContent;
      const compra = div.querySelector('p:nth-of-type(1)').textContent;
      const venta = div.querySelector('p:nth-of-type(2)').textContent;
      return `${nombre}: ${compra}, ${venta}`;
    })
    .join('\n');

  if (nombre === '' || email === '' || mensaje === '') {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:5000/enviar-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nombre,
        email: email,
        message: mensaje,
        cotizaciones: cotizaciones,
      }),
    });

    if (response.ok) {
      console.log('¡Correo enviado exitosamente!');
      alert('Correo enviado exitosamente.');
    } else {
      console.error('Error al enviar el correo:', response.status);
      alert('Error al enviar el correo.');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    alert('Hubo un problema al intentar enviar el correo.');
  }

  form.reset();
});
