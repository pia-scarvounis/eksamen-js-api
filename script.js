// fetching pokemon-api, try & catch:
let allPokemons;

async function fetchPokemons() {
    const pokemonRequest = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    const result = await pokemonRequest.json();
    return result.results;
}

async function showPokemons() {
    const pokemons = await fetchPokemons();
}
showPokemons();

async function fetchAndShowPokemons(){
    try {
        allPokemons = await fetchPokemons();
    } catch(error) {
        console.error("Det har skjedd en feil. Kom tilbake senere", error);
    }
}
fetchAndShowPokemons();