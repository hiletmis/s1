const expressJwt = require('express-jwt');
require('dotenv').config();

module.exports = jwt;

function jwt() {
    const secret = process.env.JWT_SECRET;
    return expressJwt({ secret, isRevoked, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            process.env.API_PREFIX + '/users/authenticate',
            process.env.API_PREFIX + '/companies/authenticate',
        ]
    });
}

async function isRevoked(req, payload, done) {
    done();
};