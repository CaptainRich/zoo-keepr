// The main file the server will run from.


// Setup so the 'animals' JSON file can be used
const {animals} = require( './data/animals' );

// Indicate we need to use 'express'
const express = require('express');

// Instantiate the server
const PORT = process.env.PORT || 3001;
const app = express();

// Need to intercept data for POST requests and transform it to JSON
// Parse incoming string or data array.  This method takes incoming PSOT data
// and converts it to key/value pairings that can be accessed in the request.body object.
// The nested extend informs the server there could be nested data to deal with.
app.use( express.urlencoded( { extend: true } ) );

// Parse incoming JSON data. This method takes incoming JSON data and parses it into
// the request.body object.
app.use( express.json() );

//////////////////////////////////////////////////////////////////////////////////////
// Setup a 'filter query' function
function filterByQuery( query, animalsArray ) {

    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    if( query.personalityTraits ) {  // query on personality traits
        // Save personality traits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save
        if( typeof query.personalityTraits === 'string' ) {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        };

        // Now loop through each trait in the personalityTraits array.
        personalityTraitsArray.forEach( trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it started as a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain that specific trait,
            // At the end we'll have an array of animals that have every one 
            // of the traits (in the query) when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
             );
        });

    };

    if( query.diet ) {   // query on diet
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }

    if (query.species) {  // query on species
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }

    if (query.name) {  // query on name
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    return filteredResults;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to find by Id.
function findById( id, animalsArray ) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add the route to the 'animals' data
app.get( '/api/animals/', (req, res) => {

    let results = animals;
   
    // The query will come from the browser address line, i.e. an API request '?parameter=target'
    if( req.query ) {
        results = filterByQuery( req.query, results );
    }

    res.json(results);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a new route, with a specific ID.  Note a parameter route must follow the non-parameter route
app.get( '/api/animals/:id', (req, res) => {
    const result = findById( req.params.id, animals );

    if( result ) {
        res.json(result);
    }
    else {
        res.send( 404 );
    };

});


////////////////////////////////////////////////////////////////////////////////////////////////
// Define the 'post' function to store data on the server
app.post('/api/animals', (req, res) => {
  // The (request) req.body is where the incoming content will be
  console.log(req.body);
  res.json(req.body);
} );


//////////////////////////////////////////////////////////////////////////////////////////////
// Setup the server to listen on port 3001, if HEROKU didn't set the environment variable.
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})