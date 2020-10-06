// The main file the server will run from.


// Import the node.js packages we need
const fs   = require( 'fs' );          // file system
const path = require( 'path' );        // package dealing with path/directory names

// Import the 'api' and 'html' routes for this application from our subdirectories
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


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
    console.log(`API server now on port ${PORT}.`);
})