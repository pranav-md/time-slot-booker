const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Import routes

const app = express();
app.use(cors({ origin: true })); // Enable CORS if needed
app.use(express.json()); // Parse JSON body for POST requests

// Use the routes defined in routes.js
app.use('/', routes);

// Export the app as an API function for Firebase Functions
exports.api = functions.https.onRequest(app);
