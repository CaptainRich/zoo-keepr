
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Import the other modules needed.
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require('../../lib/animals');
const { zookeepers } = require('../../data/zookeepers');

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Define an instance of 'Router', since we can't use 'app' here ('app' is instantiated in 'server.js')
const router = require('express').Router();


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add the route to the 'zookeepers' data
router.get( '/zookeepers/', (req, res) => {

    let results = zookeepers;
   
    // The query will come from the browser address line, i.e. an API request '?parameter=target'
    if( req.query ) {
        results = filterByQuery( req.query, results );
    }

    res.json(results);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define a new route, with a specific ID.  Note a parameter route must follow the non-parameter route
router.get( '/zookeepers/:id', (req, res) => {
    const result = findById( req.params.id, zookeepers );

    if( result ) {
        res.json(result);
    }
    else {
        res.send( 404 );
    };

});


////////////////////////////////////////////////////////////////////////////////////////////////
// Define the 'post' function to store data on the server
router.post('/zookeepers', (req, res) => {
  // The (request) req.body is where the incoming content will be

  // Set the animal's ID based on what the next index of the array will be.
  req.body.id = zookeepers.length.toString();

  // Now that we have a new ID, add the zookeepers to the JSON file and the zookeepers array.  First
  // validate the data, and if problems, send back a '400 error'.
  if( !validateZookeeper( req.body ) ) {
      res.status(400).send('The animal is not properly formatted.');
  } else {
    const zookeeper = createNewZookeeper( req.body, zookeepers );
    //console.log(req.body);
    res.json(zookeeper);
  };
} );

module.exports = router;
