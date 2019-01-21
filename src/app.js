const express = require('express');
const app = express();

module.exports = app;

const routeConfig = require('./config/route-config');

routeConfig.init(app);