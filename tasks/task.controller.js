const express = require('express');
const router = express.Router();
const taskService = require('./task.service.js');

// routes
router.post('/create', createTask);
router.post('/update', updateTask);
router.post('/delete', deleteTask);
router.get('/get', getTasks);

module.exports = router;

function createTask(req, res, next) {
    taskService.createTask(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function updateTask(req, res, next) {
    taskService.updateTask(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function deleteTask(req, res, next) {
    taskService.deleteTask(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getTasks(req, res, next) {
    taskService.getTasks(req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}