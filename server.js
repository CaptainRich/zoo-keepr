// The main file the server will run from.
// Richard Ay, October 2020


// Import the node.js packages we need
const fs   = require( 'fs' );          // file system
const path = require( 'path' );        // package dealing with path/directory names

// Import the 'api' and 'html' routes for this application from our subdirectories
const apiRoutes  = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


// Setup so the 'animals' JSON file can be used
const {animals}  = require( './data/animals' );

// Indicate we need to use 'express'
const express    = require('express');

// Instantiate the server.  Use the Heroku port, or if not set, port 3001
const PORT = process.env.PORT || 3001;
const app = express();

// Need to intercept data for POST requests and transform it to JSON
// Parse incoming string or data array.  This method takes incoming POST data
// and converts it to key/value pairings that can be accessed in the request.body object.
// The nested extend informs the server there could be nested data to deal with.

// The 'app.use' method mounts a function to the server that all our requests will pass through
// before getting to the endpoint.  Such (mounted) functions are referred to as middle-ware.
// The 'express.urlencoded' method takes incoming POST data and converts it to key/value pairs 
// that can be accessed in the 'req.body' object.
app.use( express.urlencoded( { extend: true } ) );

// Parse incoming JSON data. This method takes incoming JSON data and parses it into
// the request.body object.  This is also middle-ware.
app.use( express.json() );

// Use our routing routines
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Handle any static web pages that may be needed (.css, .js, .img) to properly
// form the HTML pages.  We don't need a specific server endpoint for these files.
app.use( express.static( 'public' ) );






//////////////////////////////////////////////////////////////////////////////////////////////
// Setup the server to listen on port 3001, if HEROKU didn't set the environment variable.
// The 'app.listen' route should always be last in the file.
app.listen(PORT, () => {
    console.log(`API server now running on port ${PORT}.`);
})