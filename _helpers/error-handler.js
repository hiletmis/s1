module.exports = errorHandler;
const { v4: uuidv4 } = require('uuid')

const db = require('_helpers/db');
const LogEndpoint = db.LogEndpoint;

function errorHandler(err, req, res, next) {
    logMe(req, "", "", req.originalUrl, req.method, "ERROR")
    if (typeof(err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}


function logMe(req, user, isUserRole, origin, method, logLevel = "LOG") {
    const header = req.headers

    var isUser = "UserNotLoggedIn";
    var isUserRole = -1;

    if (header.authorization != null) {
        const token = header.authorization
        const tokenArray = token.split('.');
        try {
            let buff = new Buffer.from(tokenArray[1], 'base64');
            let text = buff.toString('ascii');
            let user = JSON.parse(text);
            isUser = user.sub
            isUserRole = user.def
        } catch (err) {

        }

    }

    var log = {
        _id: uuidv4(),
        ip: header["x-real-ip"],
        userAgent: header["user-agent"],
        cf_connecting_ip: header["cf-connecting-ip"],
        x_real_ip: header["x-real-ip"],
        host: header["host"],
        cf_ipcountry: header["cf-ipcountry"],
        originalUrl: origin,
        method: method,
        user: isUser,
        userRole: isUserRole,
        logLevel: logLevel
    }
    var logEndpoint = new LogEndpoint(log);
    logEndpoint.save();
}