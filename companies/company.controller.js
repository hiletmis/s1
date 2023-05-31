const express = require('express');
const router = express.Router();
const userService = require('./company.service.js');

// routes
router.post('/register', register);
router.post('/addlocation', addLocation);
router.post('/removelocation', removeLocation);
router.post('/authenticate', authenticate);
router.get('/get', getCompany);
router.get('/getbyid/:id', getCompanyById);
router.get('/getscans', getScans);
router.get('/getusers', getCompanyUsers);

module.exports = router;

function register(req, res, next) {
    userService.create(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function addLocation(req, res, next) {
    userService.addLocation(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getCompany(req, res, next) {
    userService.getCompany(req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getCompanyById(req, res, next) {
    userService.getCompanyById(req.params.id, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function removeLocation(req, res, next) {
    userService.removeLocation(req.body, req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getScans(req, res, next) {
    userService.getScans(req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}

function getCompanyUsers(req, res, next) {
    userService.getCompanyUsers(req.user)
        .then(function(users) {
            res.json(users)
        })
        .catch(function(err) {
            next(err)
        })
}