const select = document.querySelector('#criptomonedas');
const selectDivisa = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objetoCripto = {
    divisa: '',
    criptomoneda: ''
}

// Crear un Promise
const obtenerCripto = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarAPI();

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

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarDatosAPI(resultado.DISPLAY[criptomoneda][divisa]);
            
        })
}

function mostrarDatosAPI(datosCripto){
    limpiarHTML();
    // console.log(datos);
    const {PRICE, HIGHDAY, LOWDAY, IMAGEURL, LASTUPDATE} = datosCripto;

    const precio = document.createElement('p');
    precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;

    const precioMaxDia = document.createElement('p');
    precioMaxDia.innerHTML = `<p>Precio máximo del día: <span>${HIGHDAY}</span> </p>`;

    const precioMinDia = document.createElement('p');
    precioMinDia.innerHTML = `<p>Precio mínimo del dia: <span>${LOWDAY}</span> </p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Actualizado: <span>${LASTUPDATE}</span> </p>`;

    const imagen = document.createElement('img');
    // Estilos desde JS
    imagen.width = 150;
    imagen.height = 150;
    imagen.style.margin = '0';

    imagen.src = `https://cryptocompare.com/${IMAGEURL}`;

    // Insertar en el HTML
    resultado.appendChild(precio);
    resultado.appendChild(precioMaxDia);
    resultado.appendChild(precioMinDia);
    resultado.appendChild(ultimaActualizacion);
    resultado.appendChild(imagen);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    //limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
    `;
    resultado.appendChild(spinner);
    

}