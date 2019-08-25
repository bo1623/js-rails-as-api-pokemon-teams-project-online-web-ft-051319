const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const body = document.querySelector('main')

fetch(TRAINERS_URL)
.then(resp => resp.json())
.then(json => makeDiv(json))
.then(addBtnListeners)
.then(addReleaseListeners)


function makeDiv(json){
  json.forEach(trainer =>{
    body.innerHTML+=`
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>
      </ul>
    </div>
    `;
    makePokeList(trainer.pokemons, trainer.id);
  })
  //return document.querySelectorAll('.card') //to be passed as argument in addBtnListeners
}

function makePokeList(pokemons, id){
  let trainerDiv = document.querySelector(`div[data-id='${id}']`)//find div that belongs to pokemon's trainer)
  let pokeList = trainerDiv.getElementsByTagName('ul')[0]
  pokemons.forEach(pokemon =>{
    pokeList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
  })
}

// need to use this only after trainer divs have been made
function addBtnListeners(){
  let trainerDivs = document.querySelectorAll('.card')
  console.log(trainerDivs)
  trainerDivs.forEach(trainer =>{
    let addBtn = trainer.querySelector('button')
    let id = trainer.getAttribute('data-id')
    let list_size = trainer.getElementsByTagName('li').length
    addBtn.addEventListener('click',function(event){
      console.log('addbtn works')
      if (list_size < 6){
        console.log('there is still space')
        postAddPokemon(id)
      }
    })
  })
}

function postAddPokemon(id){
  fetch('http://localhost:3000/pokemons',{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({"trainer_id":`${id}`})
  })
  .then(()=>fetchLastPokemon(id))
  //if the function has an argument we need to pass '() =>'
  //otherwise we couldve just done .then(fetchLastPokemon)
  //only either of these methods would work
  //if we ran .then(fetchLastPokemon()), this would not have allowed the
  //async functions above to complete before running
}

function fetchLastPokemon(id){
  fetch(POKEMONS_URL)
  .then(resp => resp.json())
  .then(json => addPokemonLi(id,json))
}

function addPokemonLi(id,json){
  const trainerDiv = document.querySelector(`div[data-id='${id}']`)
  const pokeList = trainerDiv.getElementsByTagName('ul')[0]
  let pokemon = json[json.length-1] //getting the last pokemon entry
  pokeList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
  addReleaseListeners()
}

//add release listener for the newly added li item

function addReleaseListeners(){
  let releaseBtns = document.querySelectorAll('.release')
  releaseBtns.forEach(btn => {
    btn.addEventListener('click',function(){
      releaseDelete(btn)
      let id = btn.getAttribute('data-pokemon-id')
      deleteListItem(id)
    })
  })
}

function releaseDelete(button){
  fetch(`http://localhost:3000/pokemons/${button.getAttribute('data-pokemon-id')}`,{
    method: "DELETE"
  })
}

function deleteListItem(id){
  let listItem = document.querySelector(`button[data-pokemon-id='${id}']`).parentElement
  listItem.remove()
}
