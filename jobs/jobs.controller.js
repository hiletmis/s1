const express = require('express');
const router = express.Router();
const jobService = require('./jobs.service.js');

// routes
router.post('/create', createJob);
router.post('/update', updateJob);
router.post('/delete', deleteJob);
router.get('/get', getJobs);

module.exports = router;

function createJob(req, res, next) {
    jobService.createJob(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function updateJob(req, res, next) {
    jobService.updateJob(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function deleteJob(req, res, next) {
    jobService.deleteJob(req.body, req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}

function getJobs(req, res, next) {
    jobService.getJobs(req.user).then(function(users) { res.json(users) }).catch(function(err) { next(err) })
}