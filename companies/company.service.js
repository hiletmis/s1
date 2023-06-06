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
    calculateWorkingHours,
    update
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
    return await security.validateCompany(userParam);
}

async function getCompany(user) {
    await security.checkAdmin(user);
    return await Company.find({}, { hash: 0, username: 0, __v: 0 });
}

async function getCompanyById(companyParam, user) {
    await security.checkAuthorization(user, companyParam);
    return await Company.findById(companyParam, { hash: 0, username: 0, __v: 0 });
}

async function addLocation(locationParam, user) {
    const company = await security.checkCompany(user.sub);
    const location = security.validateLocation(locationParam);
    company.locations.push(location);

    await company.save();
    return company.locations;
}

async function removeLocation(locationParam, user) {
    const company = await security.checkCompany(user.sub);
    const location = await security.checkLocation(user.sub, locationParam.location);

    company.locations = company.locations.filter(x => x._id != location._id);
    await company.save();

    return company.locations;
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
        { $group: { _id: "$user", total: { $sum: { $round: [{ $divide: [{ $subtract: ["$outtime", "$intime"] }, 3600000] }, 3] } } } },
        { $sort: { total: -1 } }
    ]);

    return workingHours;
}

async function getScans(body, user) {
    const company = await security.checkCompany(user.sub);
    let query = queryCheck.queryBuilder(body, { company: company._id })
    return await Scans.find(query, { __v: 0, company: 0, lat: 0, long: 0, _id: 0, device: 0, createdDate: 0, id: 0 });

}

async function update(userParam, user) {
    const company = await security.checkCompany(user.sub);
    return await security.validateCompanyUpdate(company, userParam);
}