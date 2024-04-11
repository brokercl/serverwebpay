const express = require('express');
const server = express();

const morgan = require ('morgan');
server.use(morgan('dev'));

// const cors  = require ('cors');
// server.use(cors());

server.use(express.urlencoded({ extended: true })); // Middleware to parse POST request bodies

// Serve static files from the public directory
server.use(express.static('public'));

server.use(require('./routes/payRoutes'))

module.exports = server;