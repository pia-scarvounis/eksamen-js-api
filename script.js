// 1.1 liste ut 50 pokemonkort med navn, bilde og type:
const pokemonCardsContainer = document.getElementById("pokemon-cards-container");

// fetching pokemon-api, try & catch:
let allPokemons;

async function fetchPokemons() {
    const pokemonRequest = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    const result = await pokemonRequest.json();
    return result.results;
}

async function fetchAndShowPokemons() {
   const pokemons = await fetchPokemons()
allPokemons = [];
for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    try {
            const response = await fetch(pokemon.url);
            const details = await response.json();
            allPokemons.push(details); // bruke denne i filtreringen 
            showPokemonCard(details);
    } catch(error) {
        console.error("Det har skjedd en feil. Kom tilbake senere", error);
    }
}}
// lage og vise kort
function showPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    image.className = 'pokemon-image'; // klarte ikke å laste inn bilde, måtte spørre om hjelp for å fikse det. chat gpt. har lest meg opp på sprites :) 

    // legge til pokè-navn og (kun en) pokè-type:
    const name = document.createElement('h2');
    name.textContent = pokemon.name;
    name.className = 'pokemon-name';

    const type = document.createElement('p');
    if (pokemon.types.length > 0) {
        type.textContent = `Type: ${pokemon.types[0].type.name}`;
    }
    type.className = 'pokemon-type';

    // legge til knapper på kort 
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn btn';
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn btn';
    deleteBtn.textContent = "Delete";

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn btn';
    saveBtn.textContent = "Save"


    // appende bilde, navn, type, knapper til kort
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    card.appendChild(saveBtn);

   // appende alle kort til nettsiden
    pokemonCardsContainer.appendChild(card);
}
fetchAndShowPokemons();

// fetche / filtrere pokemontyper til knapper 
async function fetchAndDisplayPokemonTypes() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        
        const typesContainer = document.getElementById("types-container");

        data.results.forEach(type => {
            const button = document.createElement("button");
            button.textContent = type.name;
            button.addEventListener("click", () => filterPokemonsByType(type.name)); 
            typesContainer.appendChild(button);
        });
    } catch (error) {
        console.error("Det oppstod en feil under henting av Pokémon-typer", error);
    }
}

fetchAndDisplayPokemonTypes();

function filterPokemonsByType(selectedType) {
    const filteredPokemons = allPokemons.filter(pokemon => pokemon.types[0].type.name === selectedType
    );

    pokemonCardsContainer.innerHTML = ''; 
    filteredPokemons.forEach(pokemon => showPokemonCard(pokemon));
} 
// må ta bort typene "shadow" & "unknown" fra knappene da de ikke står i oppgaven, fikse det i morgen










