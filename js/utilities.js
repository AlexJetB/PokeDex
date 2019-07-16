export function getJson(url) {
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

export function nukeButtons() {
  let nextButton = document.getElementById('nextButton'),
      nextClone = nextButton.cloneNode(true);
  let prevButton = document.getElementById('prevButton'),
      prevClone = prevButton.cloneNode(true);
  nextButton.parentNode.replaceChild(nextClone, nextButton);
  prevButton.parentNode.replaceChild(prevClone, prevButton);
}
