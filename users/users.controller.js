const express = require('express');
const router = express.Router();
const userService = require('./user.service.js');

// routes
router.post('/register', register);
router.post('/update', update);
router.post('/authenticate', authenticate);

module.exports = router;

function register(req, res, next) {
    userService.create(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function update(req, res, next) {
    userService.update(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function authenticate(req, res, next) {
    userService.authenticate(req.body).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}