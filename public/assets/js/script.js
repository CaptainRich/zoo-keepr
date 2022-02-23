const $animalForm    = document.querySelector('#animal-form');
const $zookeeperForm = document.querySelector('#zookeeper-form');


/////////////////////////////////////////////////////////////////////////////////
const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name          = $animalForm.querySelector('[name="animal-name"]').value;
  const species       = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  ////////////////////////////////////////////////////////////////////////
  // Send the data to the endPoint.
  fetch( '/api/animals', {                // the request is coming from the Server, don't need the full path here
    method: 'POST',
    headers: {
      Accept: 'application/json',         // this informs that the request is going to be JSON data
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( animalObject )  // add the stringified JSON data
  })
  .then( response => {
    if( response.ok ) {
      return response.json();
    }
    alert( 'Error: ' + response.statusText );
  })
  .then( postResponse => {
    console.log( postResponse );
    alert( 'Thank you for adding an animal!' );
  });

};


////////////////////////////////////////////////////////////////////////////////////////////
const handleZookeeperFormSubmit = event => {
  event.preventDefault();

  // Get the zookeeper data and organize it
  const name = $zookeeperForm.querySelector('[name="zookeeper-name"]').value;
  const age = parseInt($zookeeperForm.querySelector('[name="age"]').value);
  const favoriteAnimal = $zookeeperForm.querySelector('[name="favorite-animal"]').value;

  const zookeeperObj = { name, age, favoriteAnimal };
  console.log(zookeeperObj);

  // Send the data to the endpoint
  fetch('api/zookeepers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(zookeeperObj)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
    })
    .then(postResponse => {
      console.log(postResponse);
      alert('Thank you for adding a zookeeper!');
    });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
$zookeeperForm.addEventListener('submit', handleZookeeperFormSubmit);
