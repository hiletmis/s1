const express = require('express');
const router = express.Router();
const shiftService = require('./shifts.service.js');

// routes
router.post('/create', createShift);
router.post('/update', updateShift);
router.post('/delete', deleteShift);
router.get('/get', getShifts);

module.exports = router;

function createShift(req, res, next) {
    shiftService.createShift(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function updateShift(req, res, next) {
    shiftService.updateShift(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function deleteShift(req, res, next) {
    shiftService.deleteShift(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getShifts(req, res, next) {
    shiftService.getShifts(req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}