import { getJson, nukeButtons } from './utilities.js';
import PokeModel from './pokeModel.js';
import PokeView from './pokeView.js';
// This is the base URL
const url = 'https://pokeapi.co/api/v2/';

export default class PokeController {
  constructor () {
    this.baseURL = 'https://pokeapi.co/api/v2/';
    this.indivURL = '';
    this.pokeModel = new PokeModel();
    this.pokeView = new PokeView();
  }

  nextOfType(data, listKind) {
    if (pokeController.pokeModel.pagEnd < data.length) {
      let prevButton = document.getElementById('prevButton'),
          prevClone = prevButton.cloneNode(true);
      prevButton.parentNode.replaceChild(prevClone, prevButton);

      const pagStart = pokeController.pokeModel.pagStart += 15;
      const pagEnd = pokeController.pokeModel.pagEnd += 15;
      this.pokeView.buildList(data, listKind, pagStart, pagEnd);
      this.buildButtons(data, listKind, pagStart, pagEnd);
    } else {
      console.log("Cannot proceed to empty next!")
    }
  }

  prevOfType(data, listKind){
    if (pokeController.pokeModel.pagStart !== 0) {
      let nextButton = document.getElementById('nextButton'),
          nextClone = nextButton.cloneNode(true);
      nextButton.parentNode.replaceChild(nextClone, nextButton);

      const pagStart = this.pokeModel.pagStart -= 15;
      const pagEnd = this.pokeModel.pagEnd -= 15;
      this.pokeView.buildList(data, listKind, pagStart, pagEnd);
      this.buildButtons(data, listKind, pagStart, pagEnd);
    } else {
      console.log("Cannot proceed to empty next!")
    }
  }

  buildButtons(data, listKind, pagStart, pagEnd) {
    nextButton.addEventListener("touchend", function () {
      pokeController.nextOfType(data, listKind)
    }, {once:true});

    prevButton.addEventListener("touchend", function () {
      pokeController.prevOfType(data, listKind)
    }, {once:true});
  }

  buildSelect(data) {
    let select = document.getElementById("typeSelect");
    select.addEventListener('change', function() {
      showType(this.value)});
    select.innerHTML += data.results.map(item => `<option value="${item.name}">${item.name}</option>`)
    .join('');
  }

  init() {
    const myList = getJson(url + 'pokemon?limit=965&offset=0');
    console.log(myList);

    myList.then(data => {
      let array = this.pokeModel.buildPokeArray(data, true);
      this.pokeModel.searchArray = array;
      this.pokeModel.pagStart = 0;
      this.pokeModel.pagEnd = 15;
      //console.log(myPokeModel.searchArray);
      //console.log(array);
      this.pokeView.buildList(this.pokeModel.searchArray, true, 0, 15);
      this.buildButtons(this.pokeModel.searchArray, true, 0, 15);
    });

    const mySelect = getJson(url + 'type');
    mySelect.then(data => {
      this.buildSelect(data);
    });

    document.getElementById('pokeName').addEventListener('keyup', function() {
      search();
    });
  }
}


var pokeController = new PokeController();
pokeController.init();

// 'Public' functions...
function showType(typeExt) {
  if (typeExt !== "") {
    // "Nuke" buttons
    nukeButtons();

    console.log(typeExt);
    const newList = getJson('https://pokeapi.co/api/v2/' + 'type/' + typeExt);
    newList.then(data => {
      let array = pokeController.pokeModel.buildPokeArray(data, false);
      //console.log(array);
      pokeController.pokeView.buildList(array, false, 0, 15);
      pokeController.buildButtons(array, false, 0, 15);
    });
    return true;
  } else {
    pokeController.init();
    return false;
  }
}

// MODEL
function search() {
  nukeButtons();

  const pokeName = document.getElementById('pokeName').value.toLowerCase();
  pokeController.pokeModel.resultArray = pokeController.pokeModel.searchArray
  .filter(function(item) {
    const pokeName = document.getElementById('pokeName').value.toLowerCase();
    const regex = new RegExp(pokeName, "g");

    if (item.name.match(regex)) {
      return item;
    }
  });

  //console.log(myPokeModel.resultArray);
  pokeController.pokeView.buildList(pokeController.pokeModel.resultArray, true, 0, 15);
  pokeController.buildButtons(pokeController.pokeModel.resultArray, true, 0, 15);
}
