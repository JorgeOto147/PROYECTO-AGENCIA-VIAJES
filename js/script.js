// Buscador de viajes
const buscador = document.getElementById('buscador');
const resultado = document.getElementById('resultado');

const quitarTildes = (texto) => {
  return texto.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u');
};

const buscarViajes = () => {
  const texto = quitarTildes(document.getElementById('buscar').value.toLowerCase().trim());
  const categoria = document.getElementById('categoria').value;
  const destinos = document.querySelectorAll('.destino');
  let encontrados = 0;

  for (let i = 0; i < destinos.length; i++) {
    const nombre = quitarTildes(destinos[i].getAttribute('data-nombre').toLowerCase());
    const tipo = destinos[i].getAttribute('data-categoria');
    if (nombre.includes(texto) && (categoria === '' || tipo === categoria)) {
      destinos[i].style.display = 'block';
      encontrados++;
    } else {
      destinos[i].style.display = 'none';
    }
  }

  if (encontrados === 0) {
    resultado.textContent = 'No encontramos ese viaje. Prueba otro destino o categoría.';
  } else {
    resultado.textContent = encontrados + ' viajes encontrados en esta página.';
  }
};

if (buscador) {
  buscador.addEventListener('submit', (evento) => {
    evento.preventDefault();
    buscarViajes();
  });
  document.getElementById('categoria').addEventListener('change', buscarViajes);
}

// Selección de viajes
const nombres = ['Galápagos', 'Cartagena', 'Cancún', 'Cuenca', 'Baños', 'Punta Cana'];
const precios = [450, 380, 650, 180, 120, 720];
let seleccion = [];
const lista = document.getElementById('lista-seleccion');

const mostrarSeleccion = () => {
  lista.innerHTML = '';
  let total = 0;

  for (let i = 0; i < seleccion.length; i++) {
    const id = seleccion[i];
    const fila = document.createElement('div');
    fila.className = 'selection-row';

    const descripcion = document.createElement('p');
    descripcion.textContent = nombres[id] + ' · 1 persona · $' + precios[id];

    const boton = document.createElement('button');
    boton.textContent = 'Eliminar';
    boton.className = 'btn btn-outline-dark';
    boton.addEventListener('click', () => {
      seleccion.splice(i, 1);
      mostrarSeleccion();
    });

    fila.appendChild(descripcion);
    fila.appendChild(boton);
    lista.appendChild(fila);
    total = total + precios[id];
  }

  if (seleccion.length === 0) lista.textContent = 'Todavía no has seleccionado un viaje.';
  document.getElementById('total').textContent = 'Total orientativo: $' + total;

  const contadores = document.querySelectorAll('.contador');
  for (let i = 0; i < contadores.length; i++) contadores[i].textContent = seleccion.length;
};

if (lista) {
  const botones = document.querySelectorAll('.agregar');
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', () => {
      const id = Number(botones[i].getAttribute('data-id'));
      if (seleccion.includes(id)) {
        alert('Este viaje ya está seleccionado.');
      } else {
        seleccion.push(id);
        mostrarSeleccion();
      }
    });
  }

  document.getElementById('vaciar').addEventListener('click', () => {
    seleccion = [];
    mostrarSeleccion();
  });
  mostrarSeleccion();
}

// Formulario de contacto
const formulario = document.getElementById('formulario');

if (formulario) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const estado = document.getElementById('estado-formulario');

    if (nombre.length < 3 || mensaje.length < 10) {
      estado.textContent = 'Escribe un nombre de al menos 3 caracteres y un mensaje de al menos 10.';
    } else {
      estado.textContent = '¡Gracias, ' + nombre + '! Recibimos tu consulta y te responderemos pronto.';
      formulario.reset();
    }
  });
}
