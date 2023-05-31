const express = require('express');
const router = express.Router();
const dailyService = require('./daily.service.js');

// routes
router.post('/add', createDailyTask);
router.post('/update', updateTask);
router.post('/delete', deleteTask);
router.get('/get', getTasts);

module.exports = router;

function createDailyTask(req, res, next) {
    dailyService.createTask(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function updateTask(req, res, next) {
    dailyService.updateTask(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function deleteTask(req, res, next) {
    dailyService.deleteTask(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getTasts(req, res, next) {
    dailyService.getTasts(req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}