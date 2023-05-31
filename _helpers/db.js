const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }).catch(function(reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
}).then(function(r) {
    console.log("connection established")
});

mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model.js'),
    Company: require('../companies/company.model.js'),
    Scan: require('../scan/scan.model.js'),
    Task: require('../tasks/task.model.js'),
    Daily: require('../daily/daily.model.js'),
    LogEndpoint: require('../logEndpoint/log.endpoint.model.js')
};