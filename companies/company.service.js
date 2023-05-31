const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const security = require('_helpers/security.check');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = db.User;
const Company = db.Company;

module.exports = {
    create,
    authenticate,
    getCompany,
    getCompanyById,
    addLocation,
    removeLocation
};

async function authenticate({ username, password }) {
    const user = await Company.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
        return {
            ...userWithoutHash,
            token
        };
    } else {
        throw ("Authentication Error")
    }
}

async function create(userParam, admin) {
    await security.checkAdmin(admin);

    if (userParam.username == null) {
        throw ("E-mail address is required")
    }

    if (userParam.password == null) {
        throw ("Password is required")
    }

    if (userParam.password.length < 6) {
        throw ("Password must be at least six characters long")
    }

    if (userParam.companyname == null) {
        throw ("Company name is required")
    }

    if (userParam.address == null) {
        throw ("Address is required")
    }

    const username = userParam.username
    const isUser = await Company.findOne({ username });

    if (isUser != null) {
        throw ("This e-mail address is already in use")
    }

    const company = new Company(userParam);

    if (userParam.password) {
        company.hash = bcrypt.hashSync(userParam.password, 10);
    }

    company._id = uuidv4()

    // save user
    await company.save();
    return company;
}

async function getCompany(user) {
    await security.checkAdmin(user);
    return await Company.find({}, { hash: 0, username: 0, __v: 0 });
}

//get company by id
async function getCompanyById(companyParam, user) {
    await security.checkAuthorization(user, companyParam);
    return await Company.findById(companyParam, { hash: 0, username: 0, __v: 0 });
}

async function addLocation(locationParam, user) {
    const company = await security.checkCompany(user.sub);

    if (locationParam.name == null) {
        throw ("Location name is required")
    }

    if (locationParam.address == null) {
        throw ("Address is required")
    }

    if (locationParam.lat == null) {
        throw ("Latitude is required")
    }

    //check if lat is number
    if (isNaN(locationParam.lat)) {
        throw ("Latitude must be a number")
    }

    if (locationParam.long == null) {
        throw ("Longitude is required")
    }

    if (isNaN(locationParam.long)) {
        throw ("Latitude must be a number")
    }

    const location = {
        _id: uuidv4(),
        name: locationParam.name,
        address: locationParam.address,
        lat: locationParam.lat,
        long: locationParam.long
    }

    company.locations.push(location);

    await company.save();
    return company;
}

async function removeLocation(locationParam, user) {
    await security.checkAuthorization(user, locationParam.company);

    if (locationParam.company == null) {
        throw ("Company is required")
    }

    if (locationParam.location == null) {
        throw ("Location is required")
    }

    const company = await security.checkCompany(locationParam.company);
    const location = company.locations.find(x => x._id == locationParam.location);

    if (location == null) {
        throw ("The location does not exist")
    }

    company.locations = company.locations.filter(x => x._id != locationParam.location);

    await company.save();
    return company;
}