// The main file the server will run from.


// Setup so the 'animals' JSON file can be used
const {animals} = require( './data/animals' );

// Indicate we need to use 'express'
const express = require('express');

// Instantiate the server
const PORT = process.env.PORT || 3001;
const app = express();

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


// Add the route to the 'animals' data
app.get( '/api/animals/', (req, res) => {

    let results = animals;
   
    // The query will come from the browser address line, i.e. an API request '?parameter=target'
    if( req.query ) {
        results = filterByQuery( req.query, results );
    }

    res.json(results);
});

// Setup the server to listen on port 3001
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})