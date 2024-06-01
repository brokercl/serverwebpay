const express = require('express');
const ejs = require('ejs');
const server = express();
// Set EJS as the view engine
server.set('view engine', 'ejs');

const morgan = require ('morgan');
server.use(morgan('dev'));

// const cors  = require ('cors');
// server.use(cors());

server.use(express.urlencoded({ extended: true })); // Middleware to parse POST request bodies

// Serve static files from the public directory
server.use(express.static('public'));

server.use(require('./routes/payRoutes'))

module.exports = server;