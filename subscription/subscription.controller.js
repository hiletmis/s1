const express = require('express');
const router = express.Router();
const subService = require('./subscription.service.js');

// routes
router.post('/create', createSubscription);
router.post('/update', updateSubscription);
router.get('/get', getSubscription);

module.exports = router;

function createSubscription(req, res, next) {
    subService.createSubscription(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function updateSubscription(req, res, next) {
    subService.updateSubscription(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getSubscription(req, res, next) {
    subService.getTasks(req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}