// Mundo Travel - script.js
// Mateo Villarroel


// ---------- Funciones generales ----------

let tiempoAviso;

function mostrarAviso(texto) {
  let aviso = document.getElementById('aviso');
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(tiempoAviso);
  tiempoAviso = setTimeout(function () {
    aviso.classList.remove('visible');
  }, 2500);
}

// para que "galapagos" encuentre "Galápagos"
function quitarTildes(texto) {
  return texto.toLowerCase()
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u')
    .replaceAll('ü', 'u')
    .replaceAll('ñ', 'n');
}


// ---------- Selección de viajes ----------
// se guarda en localStorage para no perderla al cambiar de página

let CLAVE = 'mundoTravelSeleccion';

function leerSeleccion() {
  try {
    let guardado = localStorage.getItem(CLAVE);
    if (guardado) {
      let datos = JSON.parse(guardado);
      if (Array.isArray(datos)) {
        return datos;
      }
    }
  } catch (error) {
    console.log('No se pudo leer la selección');
  }
  return [];
}

function guardarSeleccion() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(seleccion));
  } catch (error) {
    console.log('No se pudo guardar la selección');
  }
}

function estaSeleccionado(nombre) {
  for (let i = 0; i < seleccion.length; i++) {
    if (seleccion[i].nombre === nombre) {
      return true;
    }
  }
  return false;
}

function calcularTotal() {
  let total = 0;
  for (let i = 0; i < seleccion.length; i++) {
    total = total + seleccion[i].precio;
  }
  return total;
}

function actualizarContador() {
  let contadores = document.querySelectorAll('.contador');
  for (let i = 0; i < contadores.length; i++) {
    contadores[i].textContent = seleccion.length;
  }
}

let seleccion = leerSeleccion();
actualizarContador();


// ---------- Viajes: buscador ----------

let buscador = document.getElementById('buscador');
let campoBuscar = document.getElementById('buscar');
let campoCategoria = document.getElementById('categoria');
let resultado = document.getElementById('resultado');

function buscarViajes() {
  let texto = quitarTildes(campoBuscar.value.trim());
  let categoria = campoCategoria.value;
  let destinos = document.querySelectorAll('.destino');
  let encontrados = 0;

  for (let i = 0; i < destinos.length; i++) {
    let nombre = quitarTildes(destinos[i].getAttribute('data-nombre'));
    let tipo = destinos[i].getAttribute('data-categoria');

    if (nombre.includes(texto) && (categoria === '' || tipo === categoria)) {
      destinos[i].style.display = '';
      encontrados++;
    } else {
      destinos[i].style.display = 'none';
    }
  }

  if (encontrados === 0) {
    resultado.textContent = 'No encontramos ese viaje. Prueba otro destino o categoría.';
  } else if (encontrados === 1) {
    resultado.textContent = '1 viaje encontrado.';
  } else {
    resultado.textContent = encontrados + ' viajes encontrados.';
  }
}

if (buscador) {
  // si viene del inicio, la búsqueda llega en la URL: viajes.html?destino=banos
  let parametros = new URLSearchParams(window.location.search);
  if (parametros.get('destino')) {
    campoBuscar.value = parametros.get('destino');
  }
  if (parametros.get('categoria')) {
    campoCategoria.value = parametros.get('categoria');
  }
  buscarViajes();

  buscador.addEventListener('submit', function (evento) {
    evento.preventDefault();
    buscarViajes();
  });
  campoBuscar.addEventListener('input', buscarViajes);
  campoCategoria.addEventListener('change', buscarViajes);

  document.getElementById('ver-todos').addEventListener('click', function () {
    campoBuscar.value = '';
    campoCategoria.value = '';
    buscarViajes();
  });
}


// ---------- Viajes: lista de seleccionados ----------

let lista = document.getElementById('lista-seleccion');

function actualizarBotones() {
  let botones = document.querySelectorAll('.agregar');
  for (let i = 0; i < botones.length; i++) {
    let nombre = botones[i].getAttribute('data-viaje');
    if (estaSeleccionado(nombre)) {
      botones[i].textContent = 'Seleccionado ✓';
      botones[i].classList.add('seleccionado');
    } else {
      botones[i].textContent = 'Seleccionar ↗';
      botones[i].classList.remove('seleccionado');
    }
  }
}

function mostrarSeleccion() {
  lista.innerHTML = '';

  for (let i = 0; i < seleccion.length; i++) {
    let fila = document.createElement('div');
    fila.className = 'selection-row';

    let descripcion = document.createElement('p');
    descripcion.textContent = seleccion[i].nombre + ' · 1 persona · $' + seleccion[i].precio;

    let boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Eliminar';
    boton.className = 'btn btn-outline-dark';
    boton.addEventListener('click', function () {
      let nombre = seleccion[i].nombre;
      seleccion.splice(i, 1);
      guardarSeleccion();
      mostrarSeleccion();
      mostrarAviso(nombre + ' se quitó de tu selección.');
    });

    fila.appendChild(descripcion);
    fila.appendChild(boton);
    lista.appendChild(fila);
  }

  if (seleccion.length === 0) {
    lista.textContent = 'Todavía no has seleccionado un viaje.';
  }

  document.getElementById('total').textContent = 'Total estimado: $' + calcularTotal();
  actualizarContador();
  actualizarBotones();
}

if (lista) {
  let botones = document.querySelectorAll('.agregar');
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener('click', function () {
      let nombre = botones[i].getAttribute('data-viaje');
      let precio = Number(botones[i].getAttribute('data-precio'));

      if (estaSeleccionado(nombre)) {
        mostrarAviso(nombre + ' ya está en tu selección.');
      } else {
        seleccion.push({ nombre: nombre, precio: precio });
        guardarSeleccion();
        mostrarSeleccion();
        mostrarAviso(nombre + ' se agregó a tu selección.');
      }
    });
  }

  document.getElementById('vaciar').addEventListener('click', function () {
    seleccion = [];
    guardarSeleccion();
    mostrarSeleccion();
    mostrarAviso('Tu selección está vacía.');
  });

  mostrarSeleccion();
}


// ---------- Contacto ----------

let resumen = document.getElementById('resumen-seleccion');

if (resumen) {
  if (seleccion.length === 0) {
    resumen.innerHTML = '<p>Aún no has elegido paquetes. Puedes verlos en <a href="viajes.html">Viajes</a>.</p>';
  } else {
    let nombres = [];
    for (let i = 0; i < seleccion.length; i++) {
      nombres.push(seleccion[i].nombre + ' ($' + seleccion[i].precio + ')');
    }
    resumen.innerHTML = '';
    let texto = document.createElement('p');
    texto.textContent = 'Paquetes que te interesan: ' + nombres.join(', ') +
      '. Total estimado: $' + calcularTotal() + '. ';
    let enlace = document.createElement('a');
    enlace.href = 'viajes.html#seleccion';
    enlace.textContent = 'Editar selección';
    texto.appendChild(enlace);
    resumen.appendChild(texto);

    document.getElementById('destino-contacto').value = seleccion[0].nombre;
  }
}

// URL de la hoja de Google (Apps Script). Pegar aquí la URL que termina en /exec
let URL_HOJA = 'https://script.google.com/macros/s/AKfycbwlqANlZae1pltixKm8hJaGOZ6L2KfOmyelSt6uTIzf8kK_k7VZrVhd7poKKBp7DHJx/exec';

let formulario = document.getElementById('formulario');

if (formulario) {
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    let nombre = document.getElementById('nombre').value.trim();
    let mensaje = document.getElementById('mensaje').value.trim();
    let estado = document.getElementById('estado-formulario');
    let boton = formulario.querySelector('button[type="submit"]');

    if (nombre.length < 3 || mensaje.length < 10) {
      estado.textContent = 'Escribe un nombre de al menos 3 letras y un mensaje de al menos 10.';
      return;
    }

    if (!URL_HOJA.startsWith('https://script.google.com/')) {
      estado.textContent = '¡Gracias, ' + nombre + '! Tus datos están correctos.';
      formulario.reset();
      return;
    }

    // datos del formulario + paquetes elegidos en Viajes
    let datos = new URLSearchParams(new FormData(formulario));
    let paquetes = [];
    for (let i = 0; i < seleccion.length; i++) {
      paquetes.push(seleccion[i].nombre);
    }
    datos.append('paquetes', paquetes.join(', '));

    boton.disabled = true;
    estado.textContent = 'Enviando...';

    // fetch envía los datos por internet a la hoja de Google
    fetch(URL_HOJA, { method: 'POST', mode: 'no-cors', body: datos })
      .then(function () {
        estado.textContent = '¡Gracias, ' + nombre + '! Tu consulta se guardó y te responderemos pronto.';
        formulario.reset();
      })
      .catch(function () {
        estado.textContent = 'No se pudo enviar. Revisa tu conexión a internet e inténtalo de nuevo.';
      })
      .finally(function () {
        boton.disabled = false;
      });
  });
}
