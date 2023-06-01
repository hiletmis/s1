const db = require('_helpers/db');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const User = db.User;
const Company = db.Company;

module.exports = {
    checkUser,
    checkAdmin,
    checkAuthorization,
    checkCompany,
    checkUserExists,
    getUser,
    checkUserRoleUpdate,
    validateInput,
    validateUserUpdate,
    validateUserCreate,
    checkDevice,
    checkLocation
};
/**
 * 
 * 
 * @param {User} user
 * @returns
 * @throws
 * @description Checks if the user exists
 * 
 **/
async function checkUser(user) {
    const isUser = await User.findById(user.sub);

    if (isUser == null) {
        throw ("The user does not exist")
    }
}

/**
 * 
 * @param {User} user
 * @returns
 * @throws
 * @description Checks if the user is an admin
 * 
 **/

async function checkAdmin(user) {
    if (user.role != 777) {
        throw ("Unauthorized")
    }
}

/**
 *  
 * @param {User} user
 * @param {String} company
 * @returns
 * @throws
 * @description Checks if the user is authorized to access the company
 *  
 **/
async function checkAuthorization(user, company) {
    if (user.role != 777) {
        const isUser = await User.findById(user.sub);

        if (isUser == null) {
            throw ("The user does not exist")
        }

        if (isUser.company != company) {
            throw ("Unauthorized")
        }
    }
}

//check if the company exists

/**
 *  
 * @param {String} companyID
 * @returns
 * @throws
 * @description Checks if the company exists
 * 
 **/

async function checkCompany(companyID) {
    const company = await Company.findById(companyID, { hash: 0, __v: 0 });

    if (company == null) {
        throw ("The company does not exist")
    }

    return company;
}

/**
 *  
 * @param {String} username
 * @returns
 * @throws
 * @description Checks if the user exists
 * 
 **/

async function checkUserExists(username) {
    const isUser = await User.findOne({ username });

    if (isUser != null) {
        throw ("This e-mail address is already in use")
    }
}

/**
 *  
 * @param {User} user
 * @returns
 * @throws
 * @description Gets the user
 * 
 **/

async function getUser(user) {
    const isUser = await User.findById(user);

    if (isUser == null) {
        throw ("The user does not exist")
    }

    return isUser;
}

/**
 *  
 * @param {User} user
 * @param {String} company
 * @returns
 * @throws
 * @description Checks if the user is authorized to update the user role
 *  
 **/

async function checkUserRoleUpdate(user, company) {
    if (user.role != 777) {
        const isUser = await User.findById(user.sub);

        if (isUser == null) {
            throw ("The user does not exist")
        }

        if (isUser.company != company) {
            throw ("Unauthorized")
        }
    }
}

/**
 * 
 * @param {String} lat1
 * @param {String} lon1
 * @param {String} lat2
 * @param {String} lon2
 * @returns
 * @throws
 * @description Calculates the distance between two points
 * 
 **/

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    //radius of the earth
    var R = 6371;
    //convert to radians
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    //calculate distance
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //distance in km
    var d = R * c;
    return d;
}

/**
 * 
 * @param {String} deg
 * @returns
 * @throws
 * @description Converts degrees to radians
 *  
 **/

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

/**
 * 
 * @param {String} location
 * @param {String} company
 * @returns
 * @throws
 * @description Checks if the location exists
 * 
 **/

async function checkLocation(company, location) {
    const locations = await Company.findById(company, { "__v": 0, "hash": 0, "username": 0, "createdDate": 0, "_id": 0 });

    if (locations == null) {
        throw ("The company does not have any locations")
    }

    if (location == null) {
        return locations
    }

    const locationExists = locations.locations.find(x => x._id == location)

    if (locationExists == null) {
        throw ("The location does not exist")
    }

    return locationExists
}

async function validateUserUpdate(isUser, userParam) {

    //remove userRole
    if (userParam.userRole != null) {
        userParam.userRole = null
    }

    if (userParam.password != null) {
        if (userParam.password.length < 6) {
            throw ("Password must be at least six characters long")
        }
        isUser.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // change first name
    if (userParam.firstName != null) {
        if (validateInput(userParam.firstName, "name") == true) {
            isUser.firstName = userParam.firstName
        }
    }

    // change last name
    if (userParam.lastName != null) {
        if (validateInput(userParam.lastName, "name") == true) {
            isUser.lastName = userParam.lastName
        }
    }

    // change title
    if (userParam.title != null) {
        if (validateInput(userParam.title, "name") == true) {
            isUser.title = userParam.title
        }
    }

    // change tcno
    if (userParam.tcno != null) {
        if (validateInput(userParam.tcno, "tcno") == true) {
            isUser.tcno = userParam.tcno
        }
    }

    // change tel
    if (userParam.tel != null) {
        if (validateInput(userParam.tel, "tel") == true) {
            isUser.tel = userParam.tel
        }
    }

    // change mail
    if (userParam.username != null) {
        if (isUser.username == userParam.username) {
            throw ("This e-mail address is already in use")
        } else {
            const isUserExists = await User.findOne({ username: userParam.mail });
            if (isUserExists != null) {
                throw ("This e-mail address is already in use")
            }

            if (validateInput(userParam.mail, "email") == true) {
                isUser.mail = userParam.mail
            }
        }
    }

    // change corporation
    if (userParam.company != null) {
        if (validateInput(userParam.company, "name") == true) {
            isUser.company = userParam.company
        }
    }

    // change device
    if (userParam.device != null) {
        isUser.device = userParam.device
    }

    return isUser
}

async function validateUserCreate(userParam) {

    if (userParam.username == null) {
        throw ("E-mail address is required")
    }

    if (userParam.firstName != null) {
        if (validateInput(userParam.firstName, "name") == false) {
            throw ("First name is invalid")
        }
    } else {
        throw ("First name is required")
    }

    if (userParam.lastName != null) {
        if (validateInput(userParam.lastName, "name") == false) {
            throw ("Last name is invalid")
        }
    } else {
        throw ("Last name is required")
    }

    if (userParam.password == null) {
        throw ("Password is required")
    }

    if (userParam.password.length < 6) {
        throw ("Password must be at least six characters long")
    }

}

async function checkDevice(device, user) {
    if (device == null) {
        throw ("Device is required")
    }

    if (user.device != device) {
        user.device = device
        await user.save()
        return
    }

}

/**
 *  
 * @param {String} input
 * @param {String} mode
 * @returns
 * @throws
 * @description Validates the input
 * 
 **/

function validateInput(input, mode) {

    switch (mode) {
        case "name":
            return validateName(input)
        case "email":
            return validateEmail(input)
        case "password":
            return validatePassword(input)
        case "tcno":
            return validateTcno(input)
        case "tel":
            return validateTel(input)
        default:
            return false
    }
}

function validateName(input) {
    //check name regex with turkish characters

    var nameRegex = /^[A-Za-zÇçĞğİıÖöŞşÜü]+(?:\s+[A-Za-zÇçĞğİıÖöŞşÜü]+)*$/;
    //validate input with regex
    if (!nameRegex.test(input)) {
        return false;
    }
    return true
}

function validateEmail(input) {
    //email regex
    var emailRegex = /\S+@\S+\.\S+/;
    //validate input with regex
    if (!emailRegex.test(input)) {
        return false;
    }
    return true
}

function validatePassword(input) {
    //password regex
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    //validate input with regex
    if (!passwordRegex.test(input)) {
        return false;
    }
    return true
}

function validateTcno(input) {
    //tcno regex
    var tcnoRegex = /^[1-9]{1}[0-9]{9}[02468]{1}$/;
    //validate input with regex
    if (!tcnoRegex.test(input)) {
        return false;
    }
    return true
}

function validateTel(input) {
    //tel regex
    var telRegex = /^(\+90|0)?5\d{9}$/;
    //validate input with regex
    if (!telRegex.test(input)) {
        return false;
    }
    return true
}