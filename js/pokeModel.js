import { getJson, nukeButtons } from './utilities.js';

export default class PokeModel {
  constructor () {
    this.searchArray = [];
    this.resultArray = [];
    this.pagStart = 0;
    this.pagEnd = 0;
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
