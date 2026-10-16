// Temas usados: variables, arreglos, funciones, if, for y eventos.
// 1. BUSCADOR: cambia la visibilidad de las tarjetas de esta página.
let buscador = document.getElementById('buscador');
let resultado = document.getElementById('resultado');
function buscarViajes() {
  let texto = document.getElementById('buscar').value.toLowerCase().trim();
  let categoria = document.getElementById('categoria').value;
  let destinos = document.querySelectorAll('.destino');
  let encontrados = 0;
  // Reemplazos sencillos para buscar con o sin tilde.
  texto = texto.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u');
  for (let i = 0; i < destinos.length; i++) {
    let nombre = destinos[i].getAttribute('data-nombre').toLowerCase();
    nombre = nombre.replaceAll('á', 'a').replaceAll('é', 'e').replaceAll('í', 'i').replaceAll('ó', 'o').replaceAll('ú', 'u');
    let tipo = destinos[i].getAttribute('data-categoria');
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
}
if (buscador) {
  buscador.addEventListener('submit', function(evento) {
    evento.preventDefault();
    buscarViajes();
  });
  document.getElementById('categoria').addEventListener('change', buscarViajes);
}
// 2. SELECCIÓN: arreglos sencillos, sin almacenamiento ni servicios externos.
let nombres = ['Galápagos', 'Cartagena', 'Cancún', 'Cuenca', 'Baños', 'Punta Cana'];
let precios = [450, 380, 650, 180, 120, 720];
let seleccion = [];
let lista = document.getElementById('lista-seleccion');
function mostrarSeleccion() {
  lista.innerHTML = '';
  let total = 0;
  for (let i = 0; i < seleccion.length; i++) {
    let id = seleccion[i];
    let fila = document.createElement('div');
    fila.className = 'selection-row';
    let descripcion = document.createElement('p');
    descripcion.textContent = nombres[id] + ' · 1 persona · $' + precios[id];
    let boton = document.createElement('button');
    boton.textContent = 'Eliminar';
    boton.className = 'btn btn-outline-dark';
    boton.addEventListener('click', function() {
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
  let contadores = document.querySelectorAll('.contador');
  for (let i = 0; i < contadores.length; i++) contadores[i].textContent = seleccion.length;
}
if (lista) {
  let botones = document.querySelectorAll('.agregar');
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', function() {
      let id = Number(botones[i].getAttribute('data-id'));
      if (seleccion.includes(id)) {
        alert('Este viaje ya está seleccionado.');
      } else {
        seleccion.push(id);
        mostrarSeleccion();
      }
    });
  }
  document.getElementById('vaciar').addEventListener('click', function() {
    seleccion = [];
    mostrarSeleccion();
  });
  mostrarSeleccion();
}
// 3. FORMULARIO: evento submit y validación con HTML y JavaScript.
let formulario = document.getElementById('formulario');
if (formulario) {
  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    let nombre = document.getElementById('nombre').value.trim();
    let mensaje = document.getElementById('mensaje').value.trim();
    let estado = document.getElementById('estado-formulario');
    if (nombre.length < 3 || mensaje.length < 10) {
      estado.textContent = 'Escribe un nombre de al menos 3 caracteres y un mensaje de al menos 10.';
    } else {
      estado.textContent = 'Datos validados. Es una demostración: no se ha enviado ningún mensaje.';
      formulario.reset();
    }
  });
}
