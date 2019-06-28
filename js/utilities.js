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
