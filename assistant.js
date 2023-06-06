require('rootpath')();
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
var https = require('https');
var fs = require('fs');
require('dotenv').config();

const db = require('_helpers/db');

const LogEndpoint = db.LogEndpoint;
const { v4: uuidv4 } = require('uuid')

var options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_CA),
    allowH1: true,
};

let logger = (req, res, next) => {
    const header = req.headers

    var isUser = "UserNotLoggedIn";
    var isUserRole = -1;

    var log = {
        _id: uuidv4(),
        ip: header["x-real-ip"],
        userAgent: header["user-agent"],
        cf_connecting_ip: header["cf-connecting-ip"],
        x_real_ip: header["x-real-ip"],
        host: header["host"],
        cf_ipcountry: header["cf-ipcountry"],
        originalUrl: req["originalUrl"],
        method: req.method,
        user: isUser,
        userRole: isUserRole,
        signature: header["x-signature"]
    }
    var logEndpoint = new LogEndpoint(log);
    logEndpoint.save();

    next();
};

app.use(logger);

app.use(express.json({ limit: "50MB" }));
app.use(cors());

app.use(jwt());
// api routes
app.use(process.env.API_PREFIX + '/users', require('./users/users.controller'));
app.use(process.env.API_PREFIX + '/scan', require('./scan/scan.controller'));
app.use(process.env.API_PREFIX + '/task', require('./tasks/task.controller'));
app.use(process.env.API_PREFIX + '/daily', require('./daily/daily.controller'));
app.use(process.env.API_PREFIX + '/company', require('./companies/company.controller'));
app.use(process.env.API_PREFIX + '/subscription', require('./subscription/subscription.controller'));

// global error handler
app.use(errorHandler);

var p = parseInt(process.env.PORT)

var isPortTaken = function(port, fn) {
    var net = require('net')
    var tester = net.createServer()
        .once('error', function(err) {
            if (err.code == 'EADDRINUSE') {
                p += 1
                isPortTaken(p)
            }
        })
        .once('listening', function() {
            tester.close()

            var server = https.createServer(options, app);
            // start server
            server.listen(port, function() {
                console.log('ennowallet. Running on ' + port);
            });

        })
        .listen(port)
}

isPortTaken(p)