const fetchButton = document.getElementById('fetchButton');
const pokemonNameInput = document.getElementById('pokemonName');
const fetchTypeSelect = document.getElementById('fetchType');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

fetchButton.addEventListener('click', fetchPokemonData);
pokemonNameInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        fetchPokemonData();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    fetchPokemon('pikachu');
});

async function fetchPokemonData() {
    const fetchType = fetchTypeSelect.value;

    if (fetchType === 'random') {
        const randomId = Math.floor(Math.random() * 1010) + 1;
        await fetchPokemon(randomId);
    } else {
        const identifier = pokemonNameInput.value.trim().toLowerCase();
        if (identifier) {
            await fetchPokemon(identifier);
        } else {
            showError('Please enter a Pokémon name or ID');
        }
    }
}

async function fetchPokemon(identifier) {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);

        if (!response.ok) {
            throw new Error('Pokémon not found!');
        }

        const pokemonData = await response.json();
        displayPokemon(pokemonData);
    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        loadingElement.style.display = 'none';
    }
}

function displayPokemon(pokemon) {
    document.getElementById('pokemonNameDisplay').textContent =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('pokemonIdDisplay').textContent =
        `#${pokemon.id.toString().padStart(3, '0')}`;

    const imageUrl = pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default;
    document.getElementById('pokemonImage').src = imageUrl;

    const typesContainer = document.getElementById('pokemonTypes');
    typesContainer.innerHTML = '';

    const typeColors = {
        normal: '#A8A77A', fire: '#EE8130', water: '#6390F0',
        electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
        fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
        flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
        rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
        dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD'
    };

    pokemon.types.forEach(typeInfo => {
        const type = typeInfo.type.name;
        const typeElement = document.createElement('span');
        typeElement.className = 'type';
        typeElement.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeElement.style.backgroundColor = typeColors[type] || '#777';
        typeElement.style.color = type === 'electric' || type === 'ice' || type === 'psychic' || type === 'fairy' ? '#000' : '#fff';
        typesContainer.appendChild(typeElement);
    });

    document.getElementById('hp').textContent = pokemon.stats[0].base_stat;
    document.getElementById('attack').textContent = pokemon.stats[1].base_stat;
    document.getElementById('defense').textContent = pokemon.stats[2].base_stat;
    document.getElementById('speed').textContent = pokemon.stats[5].base_stat;
    document.getElementById('height').textContent = `${pokemon.height / 10} m`;
    document.getElementById('weight').textContent = `${pokemon.weight / 10} kg`;

    pokemonNameInput.value = pokemon.name;
}

function showError(message) {
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.display = 'block';
}
