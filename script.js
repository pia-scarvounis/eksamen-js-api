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
        console.error("Det oppsto en feil, kom tilbake senere", error);
    }
}}
// funksjon som gir riktig bakgrunnsfarge til type
function setTypeColor(type) {
    const colors = {
    normal: "#ffe4e1",
    fighting: "#800020",
    flying: "#039fdb",
    poison: "#ece0d1",
    ground: "#be9b7b",
    rock: "#a39193",
    bug: "#87a96b",
    ghost: "#dfe3ee",
    steel: "#f7f7f7",
    fire: "#ffad60",
    water: "#9dafe4",
    grass: "#78866b",
    electric: "#f9d62e",
    psycic: "#00dbdb",
    ice: "#caeef9",
    dragon: "#9ed670",
    dark: "#123548",
    fairy: "#ffffba"

    };
    return colors[type]
}
// lage og vise kort
function showPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const pokemonType = pokemon.types[0].type.name;
    const backgroundColor = setTypeColor(pokemonType);
    card.style.backgroundColor = backgroundColor;

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
        const removeFilterBtn = document.createElement('button'); // style denne knappen hvis tid senere. lage egen funksjon for knappestylig? 
        removeFilterBtn.textContent = "Fjern filter";
        removeFilterBtn.addEventListener("click", removeFilter);
        typesContainer.appendChild(removeFilterBtn);

        data.results.forEach(type => {
            if (type.name !== "unknown" && type.name !== "shadow") {
            const button = document.createElement("button");
            button.textContent = type.name;
            button.style.padding = "12px";
            button.style.margin = "8px";
            button.style.backgroundColor = "black"
            button.style.color = "white";
            button.style.borderRadius = "25px";
            button.addEventListener("click", () => filterPokemonsByType(type.name)); 
            typesContainer.appendChild(button);}
        });
    } catch (error) {
        console.error("Det oppstod en feil, kom tilbake senere", error);
    }
}

fetchAndDisplayPokemonTypes();

function filterPokemonsByType(selectedType) {
    const filteredPokemons = allPokemons.filter(pokemon => pokemon.types[0].type.name === selectedType
    );

    pokemonCardsContainer.innerHTML = ''; 
    filteredPokemons.forEach(pokemon => showPokemonCard(pokemon));
    hideBtns()
} 
function removeFilter() {
    pokemonCardsContainer.innerHTML = '';
    fetchAndShowPokemons();
}














