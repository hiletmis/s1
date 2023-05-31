const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const security = require('_helpers/security.check');

require('dotenv').config();

const User = db.User;
const Company = db.Company;

module.exports = {
    create,
    update,
    authenticate
};

async function authenticate({ username, password, device }) {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: user.userRole, company: user.company }, process.env.JWT_SECRET);
        return {
            ...userWithoutHash,
            token
        };
    } else {
        throw ("Authentication Error")
    }
}

async function update(userParam, payload) {
    let isUser = await security.getUser(payload.sub);
    isUser = await security.validateUserUpdate(isUser, userParam);

    await isUser.save();
    return { message: "Success" }
}

async function create(userParam, company) {
    if (company.sub == null) {
        throw ("Company is required")
    }

    const isCompany = await Company.findById(company.sub);

    if (isCompany == null) {
        throw ("The company does not exist")
    }

    if (isCompany.locations.length == 0) {
        throw ("The company has no locations")
    }

    await security.checkUserExists(userParam.username);
    await security.validateUserCreate(userParam);

    const user = new User(userParam);
    user.userRole = 0

    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    user.company = company.sub;
    user.office = isCompany.locations[0]._id;
    user._id = uuidv4()

    await user.save();

    const { hash, ...userWithoutHash } = user.toObject();
    return userWithoutHash;
}