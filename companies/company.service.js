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
    removeDepartment,
    getScans,
    getUserById,
    getCompanyUsers,
    calculateWorkingHours,
    update,
    updateUser,
};

async function authenticate({ username, password }) {
    const user = await Company.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: 1 }, process.env.JWT_SECRET, { expiresIn: '30d' });
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

async function getUserById(userParam, companyParam) {
    const company = await security.checkCompany(companyParam.sub);
    const user = await User.findById(userParam, { hash: 0, __v: 0 });

    //check if user is in company
    if (user.company != company._id) {
        throw ("User is not in company")
    }

    //check status
    if (user.status == -1) {
        throw ("User is not active")
    }

    return user;
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

async function removeDepartment(departmentParam, user) {
    const company = await security.checkCompany(user.sub);
    const department = await security.checkDepartment(user.sub, departmentParam.department);

    company.department = company.department.filter(x => x._id != department._id);
    await company.save();

    return company.department
}

async function getCompanyUsers(user) {
    const company = await security.checkCompany(user.sub);
    return await User.find({ company: company._id, status: 0 }, { hash: 0, username: 0, __v: 0, company: 0, userRole: 0, device: 0, createdDate: 0, id: 0 });
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

    //get users
    const users = await User.find({ company: company._id }, { hash: 0, username: 0, __v: 0, company: 0, userRole: 0, device: 0, createdDate: 0, id: 0 });

    //get locations
    const locations = await Company.findById(company._id, { hash: 0, username: 0, __v: 0, _id: 0, department: 0, locations: 0, id: 0 });

    //get scans
    const scans = await Scans.find(query, { __v: 0, company: 0, lat: 0, long: 0, _id: 0, device: 0, createdDate: 0, id: 0 });

    return { users, locations, scans };

}

async function update(userParam, user) {
    const company = await security.checkCompany(user.sub);
    return await security.validateCompanyUpdate(company, userParam);
}

async function updateUser(userParam, user) {
    const company = await security.checkCompany(user.sub);
    const userToUpdate = await User.findById(userParam.user);

    //if null
    if (!userToUpdate) {
        throw ("User not found")
    }

    //check if user is in company
    if (userToUpdate.company != company._id) {
        throw ("User is not in company")
    }

    return await security.validateUserUpdate(userToUpdate, userParam);
}