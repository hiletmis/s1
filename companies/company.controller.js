const express = require('express');
const router = express.Router();
const userService = require('./company.service.js');

// routes
router.post('/register', register);
router.post('/addlocation', addLocation);
router.post('/removelocation', removeLocation);
router.post('/removedepartment', removeDepartment);
router.post('/update', update);
router.post('/authenticate', authenticate);
router.get('/get', getCompany);
router.get('/getbyid/:id', getCompanyById);
router.post('/getscans', getScans);
router.get('/getusers', getCompanyUsers);
router.post('/agg', calculateWorkingHours);

module.exports = router;

function register(req, res, next) {
    userService.create(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function addLocation(req, res, next) {
    userService.addLocation(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function update(req, res, next) {
    userService.update(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function authenticate(req, res, next) {
    userService.authenticate(req.body).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getCompany(req, res, next) {
    userService.getCompany(req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getCompanyById(req, res, next) {
    userService.getCompanyById(req.params.id, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function removeLocation(req, res, next) {
    userService.removeLocation(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function removeDepartment(req, res, next) {
    userService.removeDepartment(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getScans(req, res, next) {
    userService.getScans(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getCompanyUsers(req, res, next) {
    userService.getCompanyUsers(req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function calculateWorkingHours(req, res, next) {
    userService.calculateWorkingHours(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}