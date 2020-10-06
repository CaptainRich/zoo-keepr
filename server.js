// The main file the server will run from.


// Import the node.js packages we need
const fs   = require( 'fs' );          // file system
const path = require( 'path' );        // package dealing with path/directory names


// Setup so the 'animals' JSON file can be used
const {animals} = require( './data/animals' );

// Indicate we need to use 'express'
const express = require('express');

// Instantiate the server
const PORT = process.env.PORT || 3001;
const app = express();

// Need to intercept data for POST requests and transform it to JSON
// Parse incoming string or data array.  This method takes incoming POST data
// and converts it to key/value pairings that can be accessed in the request.body object.
// The nested extend informs the server there could be nested data to deal with.
app.use( express.urlencoded( { extend: true } ) );

// Parse incoming JSON data. This method takes incoming JSON data and parses it into
// the request.body object.
app.use( express.json() );

// Handle any static web pages that may be needed (.css, .js, .img) to properly
// form the HTML pages.  We don't need a specific server endpoint for these files.
app.use( express.static( 'public' ) );

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
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to create a new Animal for the Zoo.  This function will be executed by the route's
// POST call-back function.
function createNewAnimal( body, animalsArray ) {
    const animal = body;

    animalsArray.push( animal );

    // Now write the updated array to the JSON file
    fs.writeFileSync( 
        path.join( __dirname, './data/animals.json' ),
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

  // Set the animal's ID based on what the next index of the array will be.
  req.body.id = animals.length.toString();

  // Now that we have a new ID, add the animal to the JSON file and the animals array.  First
  // validate the data, and if problems, send back a '400 error'.
  if( !validateAnimal( req.body ) ) {
      res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal( req.body, animals );
    //console.log(req.body);
    res.json(req.body);
  };
} );


///////////////////////////////////////////////////////////////////////////////////////////////////
// Setup the route to the main (starting) HTML page.  All this does is reand and send the HTML file 
// from the server to the client's browser.
app.get( '/', (req, res) => {
    res.sendFile( path.join(__dirname, './public/index.html') );
});


///////////////////////////////////////////////////////////////////////////////////////////////////
// Setup the route to the animals page.
app.get( '/animals', (req, res) => {
    res.sendFile( path.join( __dirname, './public/animals.html' ) );
});



///////////////////////////////////////////////////////////////////////////////////////////////////
// Setup the route to the ZooKeepers page.
app.get( '/zookeepers', (req, res) => {
    res.sendFile( path.join( __dirname, './public/zookeepers.html' ) );
});


//////////////////////////////////////////////////////////////////////////////////////////////
// Setup the server to listen on port 3001, if HEROKU didn't set the environment variable.
// The 'app.listen' route should always be last in the file.
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})