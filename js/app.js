const select = document.getElementById('criptomonedas');

// Crear un Promise
const obtenerCripto = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarAPI();
});

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