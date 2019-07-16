import { getJson, nukeButtons } from './utilities.js';

export default class PokeModel {
  constructor () {
    this.searchArray = [];
    this.resultArray = [];
    this.pagStart = 0;
    this.pagEnd = 0;
  }

  search() {
    nukeButtons();

    const pokeName = document.getElementById('pokeName').value.toLowerCase();
    myPokeModel.resultArray = myPokeModel.searchArray.filter(function(item) {
      const pokeName = document.getElementById('pokeName').value.toLowerCase();
      const regex = new RegExp(pokeName, "g");

      if (item.name.match(regex)) {
        return item;
      }
    });

    console.log(myPokeModel.resultArray);

    buildList(myPokeModel.resultArray, true, 0, 10);
    buildButtons(myPokeModel.resultArray, true, 0, 10);
  }

  buildPokeArray(data, whole) {
    if (whole === true) {
      return data.results.map(function (item) {
        item[String(item.name)];
        return item;
      });
    } else if (whole === false) {
      return data.pokemon.map(function (item) {
        item[String(item.pokemon.name)];
        return item;
      });
    }
  }
}
