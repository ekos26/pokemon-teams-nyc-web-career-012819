document.addEventListener('DOMContentLoaded', function() {
  const BASE_URL = "http://localhost:3000";
  const TRAINERS_URL = `${BASE_URL}/trainers`;
  const POKEMONS_URL = `${BASE_URL}/pokemons`;
  const mainTag = document.querySelector('main');
  const pokemonCard = document.querySelector('.card');
  const releaseBtn = document.querySelector('.release');

  function fetchAllTrainers() {
    return fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainers => renderAllTrainers(trainers))
  }

  function renderAllTrainers(trainers) {
    mainTag.innerHTML = '';
    trainers.forEach(function(trainer) {
      mainTag.innerHTML += `
      <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
        <div></div>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul>
        ${trainer.pokemons.map(function(pokemon) {
          return `<li>${pokemon.nickname}
          <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
        }).join("")}
        </ul>
      </div>
      `
    })
  }

  mainTag.addEventListener('click', function(e) {
    if(e.target.innerText === 'Release') {
      pokemonId = e.target.dataset.pokemonId
      deletePokemon(pokemonId)
    } else if (e.target.innerText === 'Add Pokemon') {
      addPokemon(e)
    }
  })

  function deletePokemon(id) {
    return fetch(POKEMONS_URL+`/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(fetchAllTrainers)
  }

  function addPokemon(e) {
    let addButton = e.target;
    let card = addButton.parentNode;
    let id = parseInt(card.dataset.id);
    let textArea = card.querySelector("p");
    let inputFieldArea = card.querySelector("div");
    // console.log('here', inputFieldArea)
    inputFieldArea.innerHTML = ''
    let pokemonTeamList = card.querySelector("ul").querySelectorAll("li");
    if (pokemonTeamList.length < 6) {
      fetchNewPokemon(id)
    } else {
      inputFieldArea.innerHTML = "Your team is full"
    }
  }

  function fetchNewPokemon(id) {
    return fetch(POKEMONS_URL, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({"trainer_id": id})
    })
    .then(res => res.json())
    .then(fetchAllTrainers)
  }



  fetchAllTrainers();
})
