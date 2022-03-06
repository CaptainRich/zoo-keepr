
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Import the other modules needed.
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Define an instance of 'Router', since we can't use 'app' here ('app' is instantiated in 'server.js')
const router = require('express').Router();


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add the route to the 'animals' data, non-parameter routes must appear first in the source code.
router.get( '/animals/', (req, res) => {

    let results = animals;
   
    // The query will come from the browser address line, i.e. an API request '?parameter=target'
    if( req.query ) {
        results = filterByQuery( req.query, results );
    }

    res.json(results);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a new route, with a specific ID.  Note a parameter route must follow the non-parameter route
router.get( '/animals/:id', (req, res) => {
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
router.post('/animals', (req, res) => {
    // The (request) req.body is where the incoming content will be

    // Set the animal's ID based on what the next index of the array will be.
    req.body.id = animals.length.toString();

    // Now that we have a new ID, add the animal to the JSON file and the animals array.  First
    // validate the data, and if there are problems, send back a '400 error'.
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        //console.log(req.body);
        res.json(req.body);
    };
});

///////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
