const select = document.querySelector('#criptomonedas');
const selectDivisa = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');

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