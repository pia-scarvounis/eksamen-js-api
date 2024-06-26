// local storage : lagring av brukerlagde pokemons
let userCreatedPokemons =
  JSON.parse(localStorage.getItem("userCreatedPokemons")) || [];

function saveUserCreatedPokemonsInLs() {
  localStorage.setItem(
    "userCreatedPokemons",
    JSON.stringify(userCreatedPokemons)
  );
}
// local storage / bruker saved favorites:
function getSavedCards() {
  return JSON.parse(localStorage.getItem("savedCards")) || [];
}
function saveToFavorites(pokemon) {
  let savedCards = getSavedCards();

  // sjekke om kort er lagret i fav
  const isAlreadySaved = savedCards.map(card => card.name).includes(pokemon.name);

  if (isAlreadySaved) {
    alert("Du har allerede lagret denne Pokemonen!");
    return; 
  }
// sjekke om favoritter er fullt 
  if (savedCards.length >= 5) {
    alert( 
      "Det er fullt! Du må slette et Pokemon-kort for å legge til et nytt kort"
    );
    return;
  }
  savedCards.push(pokemon);
  localStorage.setItem("savedCards", JSON.stringify(savedCards));

  showPokemonCard(pokemon, savedFavoritesContainer);
}
const savedFavoritesContainer = document.getElementById(
  "saved-favorites-container"
);
// displaySavedCards funksjon
function displaySavedCards() {
  const savedCards = getSavedCards();
  savedCards.forEach((pokemon) => {
    showPokemonCard(pokemon, savedFavoritesContainer);
  });
}
document.addEventListener("DOMContentLoaded", displaySavedCards);


// liste ut 50 pokemonkort med navn, bilde og type:
const pokemonCardsContainer = document.getElementById(
  "pokemon-cards-container"
);
pokemonCardsContainer.style.backgroundColor = "#e5f1e7";
pokemonCardsContainer.style.margin = "30px";

// fetching pokemon-api, try & catch:
let allPokemons;

async function fetchPokemons() {
  const pokemonRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=50"
  );
  const result = await pokemonRequest.json();
  return result.results;
}

async function fetchAndShowPokemons() {
  const savedUserCreatedPokemons = localStorage.getItem("userCreatedPokemons");
  if (savedUserCreatedPokemons) {
    userCreatedPokemons = JSON.parse(savedUserCreatedPokemons) || [];
    userCreatedPokemons.forEach((pokemon) => showPokemonCard(pokemon));
  }
  const pokemons = await fetchPokemons();
  allPokemons = [];
  for (let i = 0; i < pokemons.length; i++) {
    const pokemon = pokemons[i];
    try {
      const response = await fetch(pokemon.url);
      const details = await response.json();
      allPokemons.push(details); // bruke denne i filtreringen
      showPokemonCard(details);
    } catch (error) {
      console.error("Det oppsto en feil, kom tilbake senere", error);
    }
  }
}

// funksjon som gir riktig bakgrunnsfarge til type:
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
    fairy: "#e3b5f3",
  };
  return colors[type];
}

// lage og vise kort:
function showPokemonCard(pokemon, container = pokemonCardsContainer) {// fått hjelp med de siste parametere
  const card = document.createElement("div");
  card.className = "pokemon-card";

  const pokemonType = pokemon.types[0].type.name;
  const backgroundColor = setTypeColor(pokemonType);
  card.style.backgroundColor = backgroundColor;

  const image = document.createElement("img");
  image.src = pokemon.sprites.front_default;
  image.className = "pokemon-image";

  // legge til poke-navn og (kun en) poke-type:
  const name = document.createElement("h2");
  name.textContent = pokemon.name;
  name.className = "pokemon-name";

  const type = document.createElement("p");
  if (pokemon.types.length > 0) {
    type.textContent = `Type: ${pokemon.types[0].type.name}`;
  }
  type.className = "pokemon-type";

  // legge til knapper på kort:
  const btnContainer = document.createElement("div");
  btnContainer.innerHTML = `<button class="edit-btn btn">Edit</button
  > <button class="delete-btn btn"> Delete</button> <button class="save-btn btn">Save</button>`;

  // Edit btn - redigere kort:
  const editBtn = btnContainer.querySelector(".edit-btn");
  editBtn.addEventListener("click", function() {
    const newName = prompt("Nytt navn:", name.textContent);
    const newType = prompt("Ny type:", type.textContent.replace('Type: ', '')); // har fått hjelp her 
    if (newName && newType) {
      name.textContent = newName;
      type.textContent = `Type: ${newType}`;
      card.style.backgroundColor = setTypeColor(newType.toLowerCase());
    }
  });

  // delete btn - slette kort:
  const deleteBtn = btnContainer.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function() {
 
    card.remove();
  
  let savedCards = JSON.parse(localStorage.getItem("savedCards")) || [];
  savedCards = savedCards.filter(savedCard => savedCard.name !== pokemon.name);
  localStorage.setItem("savedCards", JSON.stringify(savedCards));
});

  // appende bilde, navn, type, knapper til kort:
  card.append(image, name, type, btnContainer);
  

  // save btn - lagre til favoritter:
  const saveBtn = btnContainer.querySelector(".save-btn");
  saveBtn.addEventListener("click", function () {
    saveToFavorites(pokemon);
  });

  if (container === savedFavoritesContainer) {
    saveBtn.style.display = "none";
  }
  container.appendChild(card);
}

fetchAndShowPokemons();

// fetche / filtrere pokemontyper til knapper:
async function fetchAndDisplayPokemonTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type"); 
    const data = await response.json();

    const typesContainer = document.getElementById("types-container");
    const removeFilterBtn = document.createElement("button");
    removeFilterBtn.style.padding = "12px";
    removeFilterBtn.style.letterSpacing = "1px";
    removeFilterBtn.style.margin = "4px";
    removeFilterBtn.style.backgroundColor = "white";
    removeFilterBtn.style.color = "black";
    removeFilterBtn.style.borderRadius = "25px";
    removeFilterBtn.textContent = "Fjern filter";
    removeFilterBtn.addEventListener("click", removeFilter);
    typesContainer.appendChild(removeFilterBtn);

    data.results.forEach((type) => {
      if (type.name !== "unknown" && type.name !== "shadow") {
        // endre til limit18 senere hvis tid

        // type-buttons - styling:
        const button = document.createElement("button");
        button.textContent = type.name;
        button.style.padding = "12px";
        button.style.margin = "4px";
        button.style.backgroundColor = "black";
        button.style.color = "white";
        button.style.borderRadius = "25px";
        button.addEventListener("click", () => filterPokemonsByType(type.name));
        typesContainer.appendChild(button);
      }
    });
  } catch (error) {
    console.error("Det oppstod en feil, kom tilbake senere", error);
  }
}

fetchAndDisplayPokemonTypes();
// filtrerer pokemon basert på type:
function filterPokemonsByType(selectedType) {
  pokemonCardsContainer.innerHTML = "";
  const combinedPokemons = [...allPokemons, ...userCreatedPokemons]; // anders metode
  // filtrerer sammenslått liste basert på type:
  const filteredPokemons = combinedPokemons.filter(
    (pokemon) =>
      pokemon.types[0].type.name.toLowerCase() === selectedType.toLowerCase() // har fått hjelp her
  ); // viser filtrerte pokemons
  filteredPokemons.forEach((pokemon) => showPokemonCard(pokemon));

  pokemonCardsContainer.innerHTML = "";
  filteredPokemons.forEach((pokemon) => showPokemonCard(pokemon));
  hideBtns();
} // fjerner filtreringen og viser alle pokemons:
function removeFilter() {
  pokemonCardsContainer.innerHTML = "";
  fetchAndShowPokemons();
}

// bruker - lage egen pokemon på pokemonkort:
const createYourOwnContainer = document.getElementById(
  "create-your-own-container"
); // create your own container & knapp+styling:
createYourOwnContainer.style.backgroundColor = "pink";
createYourOwnContainer.style.width = "500px";
createYourOwnContainer.style.height = "180px";
createYourOwnContainer.style.padding = "10px";
createYourOwnContainer.style.margin = "30px";
createYourOwnContainer.style.borderRadius = "15px";
const createYourOwnBtn = document.getElementById("create-your-own-btn");
createYourOwnBtn.style.padding = "12px";
createYourOwnBtn.style.letterSpacing = "1px";
createYourOwnBtn.style.margin = "40px";
createYourOwnBtn.style.backgroundColor = "white";
createYourOwnBtn.style.color = "black";
createYourOwnBtn.style.borderRadius = "25px";
// add navn til pokemon:
createYourOwnBtn.onclick = () => {
  let createPokemonName = prompt("Men først! Hva skal din pokemon hete?");
  if (createPokemonName == "") {
    alert("Du må oppgi et navn!");
    return;
  } // dropdown meny - velge pokemontype:
  const typeSelect = document.getElementById("typeSelect");
  let createPokemonType = typeSelect.value; // valgt type
  const defaultImageUrl = "assets/user.png";
  // brukers nye pokemon-objekt m type & bilde:
  const newPokemon = {
    name: createPokemonName,
    types: [{ type: { name: createPokemonType } }],
    sprites: { front_default: defaultImageUrl },
  }; // nyoppretta pokemons legges til brukerlagde pokemons:
  userCreatedPokemons.push(newPokemon);

  // vises i local storage og på siden:
  saveUserCreatedPokemonsInLs();
  showPokemonCard(newPokemon);
};
// bilde fra API
const image = document.createElement("img");
image.src = pokemon.sprites.front_default;
image.className = "pokemon-image";
// navn fra API
const name = document.createElement("h2");
name.textContent = pokemon.name;
name.className = "pokemon-name";
// type fra API
const type = document.createElement("p");
if (pokemon.types.length > 0) {
  const typeText = pokemon.types[0].type.name;
  type.textContent = `Type: ${typeText}`;
}

type.className = "pokemon-type";

card.append(image, name, type);

pokemonCardsContainer.appendChild(card);




