const select = document.querySelector('#criptomonedas');
const selectDivisa = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const divPrecio = document.querySelector('#precio');
const divImg = document.querySelector('#imagen');
const divSpinner = document.querySelector('#spinner');
const divContenedor = document.querySelector('#contenedor');

const body = document.querySelector('body');
const toggleBtn = document.querySelector('#toggle');
const objetoCripto = {
    divisa: '',
    criptomoneda: ''
}

// Crear un Promise
const obtenerCripto = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    formulario.reset();
    consultarAPI();

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        body.classList.toggle('light-theme');
        if(body.classList.contains('light-theme')){
            divPrecio.style.color = '#0d2235';
        }else{
            divPrecio.style.color = 'white';
        }
    })

    formulario.addEventListener('submit', obtenerPrecio);

    select.addEventListener('change', leerValor);
    selectDivisa.addEventListener('change', leerValor);
})
function consultarAPI() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json()) // Consulta exitosa...
        .then(resultado => obtenerCripto(resultado.Data))
        .then(criptomonedas => selectCripto(criptomonedas));
}

function selectCripto(criptomonedas) {
    criptomonedas.forEach( cripto => {
        // console.log(cripto);
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        select.appendChild(option);

    });
}

function leerValor(e) {
    objetoCripto[e.target.name] = e.target.value;
    // console.log(objetoCripto);
    
}
function obtenerPrecio(e) {
    e.preventDefault();

    const {divisa, criptomoneda} = objetoCripto;

    if(divisa === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarDatosAPI();
}

function mostrarAlerta(mensaje) {
    // console.log(mensaje);
    const existeAlerta = document.querySelector('.error');
    if(!existeAlerta) {
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('error', 'mt-10');
        divAlerta.textContent = mensaje;
        formulario.appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove();
        }, 3000); 
    }

}

function consultarDatosAPI() {
    const {divisa, criptomoneda} = objetoCripto;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${divisa}`;

    mostrarSpinner();

    // Limpio el HTML para mostrar solo lo nuevo, mientras que el spinner se muestra
    ocultarDatos();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarDatosAPI(resultado.DISPLAY[criptomoneda][divisa]);
        })
}

function mostrarDatosAPI(datosCripto){
    limpiarHTML(divSpinner);
    ocultarDatos();
    
    // console.log(datos);
    const {PRICE, HIGHDAY, LOWDAY, IMAGEURL, LASTUPDATE} = datosCripto;

    const precio = document.createElement('p');
    precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;

    const precioMaxDia = document.createElement('p');
    precioMaxDia.innerHTML = `<p>Precio máximo del día: <span>${HIGHDAY}</span> </p>`;

    const precioMinDia = document.createElement('p');
    precioMinDia.innerHTML = `<p>Precio mínimo del dia: <span>${LOWDAY}</span> </p>`;

    const ultimaActualizacion = document.createElement('p');
    // Traducir a espanol
    if(LASTUPDATE.includes('Just now')) {
        actualizacion = 'Ahora mismo';
    }
    ultimaActualizacion.innerHTML = `<p>Actualizado: <span>${actualizacion}</span> </p>`;

    const imagen = document.createElement('img');
    // Estilos desde JS
    imagen.width = 150;
    imagen.height = 150;
    imagen.style.margin = '0';

    imagen.src = `https://cryptocompare.com/${IMAGEURL}`;


    // Insertar en el HTML
    divImg.appendChild(imagen);

    divPrecio.appendChild(precio);
    divPrecio.appendChild(precioMaxDia);
    divPrecio.appendChild(precioMinDia);
    divPrecio.appendChild(ultimaActualizacion);

    divContenedor.appendChild(divImg);
    divContenedor.appendChild(divPrecio);
    
}

function limpiarHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function mostrarSpinner() {
    //limpiarHTML();
    limpiarHTML(divSpinner);

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    `;
    divSpinner.appendChild(spinner);
}

// Crear una funcion que oculte los datos de la funcion mostrarDatosAPI() mientras el spinner se muestra.
function ocultarDatos() {
    limpiarHTML(divContenedor);
    limpiarHTML(divPrecio);
    limpiarHTML(divImg);
}

// Necesito los metodos de String para trabajar con cadenas de texto
// Metodos de String
// Conocer la cantidad de letras de la cadena de texto
// console.log(producto);
// console.log(producto.length);

// Devuelve el indice del caracter de mi cadena de texto
// console.log(producto.indexOf(0));
// console.log(producto.indexOf("t")); // Si no lo encuentra devuelve -1

// Devuelve true o false si encontro el elemento en la cadena de texto
// console.log(producto.includes("t"));
// console.log(producto.includes("Precio"));    
