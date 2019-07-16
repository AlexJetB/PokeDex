import { getJson, nukeButtons } from './utilities.js';

var spriteNum = { num: 0 };
var feRegEx = /female/;
var shRegEx = /shiny/;

export default class PokeView {
  constructor () {
    this.myListElement = document.getElementById('list');
  }

  buildList(data, whole, pagStart, pagEnd) {
    const myListElement = this.myListElement; //REMOVE WHEN WORKING
    myListElement.innerHTML = '';
    if (whole === true) {
      const chunk =  data.slice(pagStart, pagEnd);

      chunk.forEach(function(element, index) {
        index += pagStart;
        let liElement = document.createElement('LI');
        liElement.innerHTML = index + 1 + '. ' + element.name;
        liElement.addEventListener('touchend', function() {
          showOnePoke(element.url);
        }, {once:false});
        myListElement.appendChild(liElement);
      });
    } else if (whole === false) {
      const chunk = data.slice(pagStart, pagEnd);

      chunk.forEach(function(element, index) {
        index += pagStart;
        let liElement = document.createElement('LI');
        liElement.innerHTML = index + 1 + '. ' + element.pokemon.name;
        liElement.addEventListener('touchend', function() {
          showOnePoke(element.pokemon.url);
        }, {once:false});
        myListElement.appendChild(liElement);
      });
    }
  }
}

async function showOnePoke(pokeURL) {
  // console.log(pokeURL);
  document.getElementById('list').style.display = 'none';
  document.getElementById('nav1').style.display = 'none';
  document.getElementById('nav2').style.display = 'flex';

  const indiv = document.getElementById('indiv')
  indiv.style.display = 'inline-block';

  const backBttn = document.getElementById('backButton');
  const viewBttn = document.getElementById('viewButton');

  const indiEntry = getJson(pokeURL);

  indiEntry.then(data => {
    indiv.innerHTML = `<div class="spriteBox">
    <img src="${data.sprites.front_default}" id="sprite">
    </div>
    <div class="statBox">
    <h4>Pokemon: <span id="shBool"></span>
    ${toUpper(data.name)}
    <span id="pokeGend">♂/♀</span></h4>
    <h4>Type: ${data.types.map(ind => ind.type.name).join(', ')}</h4>
    <h4>Base stats:</h4>
    ${data.stats.map(ind => `<h4>${toUpper(ind.stat.name)}: ${ind.base_stat}
    </h4>`).join('')}
    <h4>Abilities:</h4>
    ${data.abilities.map(ind => `<div><h5 id="${ind.ability.name}" class="ability">
    ${toUpper(ind.ability.name)}</h5></div>`).join('')}
    </div>`;

    data.abilities.forEach(ind => {
      const abilityBttn = document.getElementById(`${ind.ability.name}`);
      abilityBttn.addEventListener('touchend', function () {
        const abiDescript = getJson(ind.ability.url);
        abiDescript.then(desc => {
          console.log(desc.effect_entries[0]);
          let p = document.createElement('p');
          p.innerHTML = desc.effect_entries[0].effect;
          this.parentNode.appendChild(p);
        });
      })
    });
    const spriteArray = objToArray(data.sprites);
    spriteNum.num = 0;
    viewButton.addEventListener('touchend', function () {
      cycleView(spriteArray)
    });
  });

  /*Go back to list view by clearing and hiding individual view*/
  backBttn.addEventListener('touchend', function () {
    indiv.innerHTML = '';
    document.getElementById('list').style.display = 'block';
    document.getElementById('indiv').style.display = 'none';

    document.getElementById('nav1').style.display = 'flex';
    document.getElementById('nav2').style.display = 'none';

    let oldView = document.getElementById('viewButton');
    let newView = oldView.cloneNode(true);
    oldView.parentNode.replaceChild(newView, oldView);
  }, {once: true});
}

function cycleView(pokeSprites) {

  console.log("SPRITES LENGTH: " + pokeSprites.length);

  const currSprite = pokeSprites[spriteNum.num];
  if (shRegEx.test(currSprite)) {
    document.getElementById('shBool').innerHTML = 'Shiny';
  } else {
    document.getElementById('shBool').innerHTML = '';
  }
  if (feRegEx.test(currSprite)) {
    document.getElementById('pokeGend').innerHTML = '♀';
  } else {
    document.getElementById('pokeGend').innerHTML = '♂';
  }
  document.getElementById('sprite').src = pokeSprites[spriteNum.num];
  console.log("SPRITE NUM: " + spriteNum.num);

  if (spriteNum.num >= (pokeSprites.length - 1)) {
    spriteNum.num = 0;
  } else {
    spriteNum.num++;
  }
}

/*Converts JS object into array with only non-null values*/
function objToArray(obj) {
  console.log(obj);
  let arr = Object.keys(obj).reduce(function(result, key) {
    if (obj[key] !== null) {
      result.push(obj[key]);
    }
    return result;
  }, []);

  console.log(arr);

  return arr;
}

/*Capitalizes first string*/
function toUpper(string) {
  return (string.charAt(0).toUpperCase() + string.slice(1))
}
