const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const security = require('_helpers/security.check');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const queryCheck = require('_helpers/query.check');

require('dotenv').config();

const User = db.User;
const Company = db.Company;
const Scans = db.Scan;

module.exports = {
    create,
    authenticate,
    getCompany,
    getCompanyById,
    addLocation,
    removeLocation,
    getScans,
    getCompanyUsers,
    calculateWorkingHours
};

async function authenticate({ username, password }) {
    const user = await Company.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: 1 }, process.env.JWT_SECRET);
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
    const company = await security.checkCompany(user.sub);
    const location = company.locations.find(x => x._id == locationParam.location);

    if (location == null) {
        throw ("The location does not exist")
    }

    company.locations = company.locations.filter(x => x._id != locationParam.location);

    await company.save();
    return company;
}

async function getCompanyUsers(user) {
    const company = await security.checkCompany(user.sub);
    return await User.find({ company: company._id }, { hash: 0, username: 0, __v: 0, company: 0, userRole: 0, device: 0, createdDate: 0, id: 0 });
}

async function calculateWorkingHours(body, user) {
    const company = await security.checkCompany(user.sub);
    let query = queryCheck.queryBuilder(body, { company: company._id })

    const workingHours = await Scans.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$user",
                total: { $sum: { $round: [{ $divide: [{ $subtract: ["$outtime", "$intime"] }, 3600000] }, 3] } }
            }
        },
        { $sort: { total: -1 } }
    ]);
    return workingHours;
}

async function getScans(body, user) {
    const company = await security.checkCompany(user.sub);
    let query = queryCheck.queryBuilder(body, { company: company._id })
    return await Scans.find(query, { __v: 0, company: 0, lat: 0, long: 0, _id: 0, device: 0, createdDate: 0, id: 0 });

}