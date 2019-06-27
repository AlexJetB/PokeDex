// This is the base URL
const url = 'https://pokeapi.co/api/v2/'

// Main code execution on load...

function init() {
  const myList = getJson(url + 'pokemon?limit=10&offset=0');
  console.log(myList);

  const mySelect = getJson(url + 'type');
  mySelect.then(data => {
    buildSelect(data);
  });

  myList.then(data => {
    buildList(data);
    buildButtons(data);
  });
}


function getJson(url) {
  return fetch(url)
  .then(response => {
    if (response.ok) {
      console.log('in then', response);
      return response.json();
    } else {
      throw new Error('JSON retrieval failed!');
      console.log('Will not run.');
    }
  }).catch(err => {
    console.log(err);
  });
}

function buildList(data, listKind, pagStart, pagEnd) {
  const myListElement = document.getElementById('list');
  if (listKind === undefined) {
    myListElement.innerHTML = data.results.map(item => `<li onClick="showOnePoke('${item.url}')">${item.name}</li>`)
    .join('');
  } else if (listKind === "byType") {
    myListElement.innerHTML = data.slice(pagStart, pagEnd).map(item => `<li onClick="showOnePoke('${item.pokemon.url}')">${item.pokemon.name}</li>`)
    .join('');
  }
}

function buildTypeList(data) {
  return data.pokemon.map(function (item) {
    item[String(item.pokemon.name)];
    return item;
  });
}

function buildButtons(data, listKind, pagStart, pagEnd) {
  let nextButton = document.getElementById('nextButton'),
      nextClone = nextButton.cloneNode(true);
  let prevButton = document.getElementById('prevButton'),
      prevClone = prevButton.cloneNode(true);

  if (listKind === undefined) {
    nextButton.addEventListener("click", function next(){
      if (data.next !== null) {
        prevButton.parentNode.replaceChild(prevClone, prevButton);
        const myList = getJson(data.next);
        console.log(myList);

        myList.then(newData => {
          buildList(newData);
          buildButtons(newData);
        });
      } else {
        console.log("Cannot proceed to empty next!")
      }
    }, {once:true});

    prevButton.addEventListener("click", function prev(){
      if (data.previous !== null) {
        nextButton.parentNode.replaceChild(nextClone, nextButton);
        const myList = getJson(data.previous);
        console.log(myList);

        myList.then(newData => {
          buildList(newData);
          buildButtons(newData);
        });
      } else {
        console.log("Cannot proceed to empty previous")
      }
    }, {once:true});
  } else if (listKind === "byType") {
    nextButton.addEventListener("click", function nextOfType(){
      if (pagEnd < data.length) {
        prevButton.parentNode.replaceChild(prevClone, prevButton);

        pagStart += 10;
        pagEnd += 10;
        buildList(data, listKind, pagStart, pagEnd);
        buildButtons(data, listKind, pagStart, pagEnd);
      } else {
        console.log("Cannot proceed to empty next!")
      }
    }, {once:true});

    prevButton.addEventListener("click", function prevOfType(){
      if (pagStart !== 0) {
        nextButton.parentNode.replaceChild(nextClone, nextButton);

        pagStart -= 10;
        pagEnd -= 10;
        buildList(data, listKind, pagStart, pagEnd);
        buildButtons(data, listKind, pagStart, pagEnd);
      } else {
        console.log("Cannot proceed to empty next!")
      }
    }, {once:true});
  }
}

function buildSelect(data) {
  let select = document.getElementById("typeSelect");
  select.innerHTML += data.results.map(item => `<option value="${item.name}">${item.name}</option>`)
  .join('');
}

function showOnePoke(pokeURL) {
  const sprite = document.getElementById("sprite");
  const abilities = document.getElementById("abilities");
  const type = document.getElementById("type");
  const pokemon = getJson(pokeURL);

  pokemon.then(iData => {
    sprite.src = iData.sprites.front_default;
    abilities.innerHTML = iData.abilities.map(item => `${item.ability.name} | `)
    .join('');
    type.innerHTML = iData.types.map(item => `${item.type.name} | `).join('');
  })
}

function showType(typeExt) {
  if (typeExt !== "") {
    // "Nuke" buttons
    let nextButton = document.getElementById('nextButton'),
        nextClone = nextButton.cloneNode(true);
    let prevButton = document.getElementById('prevButton'),
        prevClone = prevButton.cloneNode(true);
    nextButton.parentNode.replaceChild(nextClone, nextButton);
    prevButton.parentNode.replaceChild(prevClone, prevButton);

    console.log(typeExt);
    const newList = getJson(url + 'type/' + typeExt);
    newList.then(data => {
      let array = buildTypeList(data);
      console.log(array);
      buildList(array, "byType", 0, 10);
      buildButtons(array, "byType", 0, 10);
    });
    return true;
  } else {
    init();
    return false;
  }
}
