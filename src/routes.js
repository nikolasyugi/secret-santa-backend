const express = require('express');

const routes = new express.Router();

const drawController = require('./controllers/draw-controller')

routes.post('/draw', drawController.draw)
routes.post('/access', drawController.access)

module.exports = routes;