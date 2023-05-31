const express = require('express');
const router = express.Router();
const userService = require('./scan.service.js');

// routes
router.post('/scan', scan);
router.get('/scanner', getScanner);

module.exports = router;

function scan(req, res, next) {
    userService.scan(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getScanner(req, res, next) {
    userService.getScanner(req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}