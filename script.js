// 1.1 liste ut 50 pokemonkort med navn, bilde og type:
const pokemonCardsContainer = document.getElementById("pokemon-cards-container");

// fetching pokemon-api, try & catch:
let allPokemons;

async function fetchPokemons() {
    const pokemonRequest = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    const result = await pokemonRequest.json();
    return result.results;
}

async function fetchAndShowPokemons(){
    try {
        pokemons = await fetchPokemons();
        for (let i = 0; i < pokemons.length; i++) {
            const response = await fetch(pokemons[i].url);
            const details = await response.json();
            showPokemonCard(details);
    } 
} catch(error) {
        console.error("Det har skjedd en feil. Kom tilbake senere", error);
    }
}
// lage og vise kort
function showPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    image.className = 'pokemon-image'; // klarte ikke å laste inn bilde, måtte spørre om hjelp for å fikse det. chat gpt. har lest meg opp på sprites :) 

    // legge til pokè-navn og (kun en) pokè-type:
    const name = document.createElement('h3');
    name.textContent = pokemon.name;
    name.className = 'pokemon-name';

    const type = document.createElement('p');
    if (pokemon.types.length > 0) {
        type.textContent = `Type: ${pokemon.types[0].type.name}`;
    }
    type.className = 'pokemon-type';

    // legge til knapper på kort 
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = "Delete";

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
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







