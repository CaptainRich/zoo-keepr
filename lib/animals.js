


// Import the node.js packages we need
const fs   = require( 'fs' );          // file system
const path = require( 'path' );        // package dealing with path/directory names (needed for Heroku)


//////////////////////////////////////////////////////////////////////////////////////
// Setup a 'filter query' function
function filterByQuery( query, animalsArray ) {

    let personalityTraitsArray = [];
    let filteredResults        = animalsArray;

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
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to create a new Animal for the Zoo.  This function will be executed by the route's
// POST call-back function.
function createNewAnimal( body, animalsArray ) {
    const animal = body;

    animalsArray.push( animal );    // This adds the new animal to the local copy of the array

    // Now write the updated array to the JSON file
    fs.writeFileSync( 
        path.join( __dirname, '../data/animals.json' ),
        JSON.stringify( { animals: animalsArray }, null, 2 )
    );

    // Return finished data to the POST routine for response
    return animal;
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Validation of new data, when adding a new animal
function validateAnimal( animal ) {

    if( !animal.name  ||  typeof  animal.name !== 'string' ) {
        return false;
    };
    
    if( !animal.species  ||  typeof  animal.species !== 'string' ) {
        return false;
    };
    
    if( !animal.diet  ||  typeof  animal.diet !== 'string' ) {
        return false;
    };

    if( !animal.personalityTraits  ||  !Array.isArray(animal.personalityTraits) ) {
        return false;
    };

    return true;
};


//////////////////////////////////////////////////////////////////////////////////////////////////
// Need to export these functions

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};