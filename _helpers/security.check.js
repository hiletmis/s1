const db = require('_helpers/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid')

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
    validateCompanyUpdate,
    validateLocation,
    validateCompany,
    validateTask,
    validateTaskUpdate,
    checkDevice,
    checkLocation,
    checkDistanceFromLatLonInKm
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

async function checkCompany(companyID, checkOnly = false) {
    const company = await Company.findById(companyID, { hash: 0, __v: 0 });

    if (company == null) {
        if (checkOnly) {
            return null;
        } else {
            throw ("The company does not exist")
        }
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

async function getUser(user, checkOnly = false) {
    const isUser = await User.findById(user);

    if (isUser == null) {
        if (checkOnly) {
            return null;
        } else {
            throw ("The user does not exist")
        }
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

function checkDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
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

    if (d > 0.5) {
        throw ("You are not at the company location")
    }

    return true
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

async function validateCompanyUpdate(company, userParam) {

    if (userParam.username != null) {
        throw ("You cannot change your e-mail address")
    }

    if (userParam.password != null) {
        if (userParam.password.length < 6) {
            throw ("Password must be at least six characters long")
        }
        company.hash = bcrypt.hashSync(userParam.password, 10);
    }

    if (userParam.companyname != null) {
        if (validateInput(userParam.companyname, "regular") == true) {
            company.companyname = userParam.companyname
        }
    }

    if (userParam.address != null) {
        if (validateInput(userParam.address, "regular") == true) {
            company.address = userParam.address
        }
    }

    if (userParam.taxNo != null) {
        if (validateInput(userParam.taxNo, "regular") == true) {
            company.taxNo = userParam.taxNo
        }
    }

    if (userParam.taxOffice != null) {
        if (validateInput(userParam.taxOffice, "regular") == true) {
            company.taxOffice = userParam.taxOffice
        }
    }

    if (userParam.city != null) {
        if (validateInput(userParam.city, "regular") == true) {
            company.city = userParam.city
        }
    }

    if (userParam.town != null) {
        if (validateInput(userParam.town, "regular") == true) {
            company.town = userParam.town
        }
    }

    if (userParam.country != null) {
        if (validateInput(userParam.country, "regular") == true) {
            company.country = userParam.country
        }
    }

    if (userParam.postalCode != null) {
        if (validateInput(userParam.postalCode, "regular") == true) {
            company.postalCode = userParam.postalCode
        }
    }

    if (userParam.mobile != null) {
        if (validateInput(userParam.mobile, "regular") == true) {
            company.mobile = userParam.mobile
        }
    }

    if (userParam.fax != null) {
        if (validateInput(userParam.fax, "regular") == true) {
            company.fax = userParam.fax
        }
    }

    //update location
    if (userParam.location != null) {
        const location = await checkLocation(company._id, userParam.location._id);

        if (userParam.location.name != null) {
            if (validateInput(userParam.location.name, "regular") == true) {
                location.name = userParam.location.name
            }
        }

        if (userParam.location.address != null) {
            if (validateInput(userParam.location.address, "regular") == true) {
                location.address = userParam.location.address
            }
        }

        if (userParam.location.lat != null) {
            //check if lat is number
            if (isNaN(userParam.location.lat)) {
                throw ("Latitude must be a number")
            }
            location.lat = userParam.location.lat
        }

        if (userParam.location.long != null) {
            //check if long is number
            if (isNaN(userParam.location.long)) {
                throw ("Longitude must be a number")
            }
            location.long = userParam.location.long
        }

        const index = company.locations.findIndex(x => x._id == location._id)
        company.locations[index] = location
    }

    await company.save();
    //return company without hash
    company.hash = null

    return company

}

async function validateCompany(companyParam) {

    if (companyParam.username == null) {
        throw ("E-mail address is required")
    }

    if (companyParam.password == null) {
        throw ("Password is required")
    }

    if (companyParam.password.length < 6) {
        throw ("Password must be at least six characters long")
    }

    if (companyParam.companyname == null) {
        throw ("Company name is required")
    }

    if (companyParam.address == null) {
        throw ("Address is required")
    }

    if (validateInput(companyParam.companyname, "regular") == false) {
        throw ("Company name is invalid")
    }

    if (validateInput(companyParam.address, "regular") == false) {
        throw ("Address is invalid")
    }

    if (validateInput(companyParam.username, "email") == false) {
        throw ("E-mail address is invalid")
    }

    if (companyParam.locations != null) {
        //validate locations
        let newLocations = []
        for (let i = 0; i < companyParam.locations.length; i++) {
            const location = validateLocation(companyParam.locations[i])
            newLocations.push(location)
        }
        companyParam.locations = newLocations
    }

    const username = companyParam.username
    const isUser = await Company.findOne({ username });

    if (isUser != null) {
        throw ("This e-mail address is already in use")
    }

    const company = new Company(companyParam);

    if (companyParam.password) {
        company.hash = bcrypt.hashSync(companyParam.password, 10);
    }

    company._id = uuidv4()

    // save user
    await company.save();

    //return company without hash
    company.hash = null
    return company;
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
    if (userParam.position != null) {
        if (validateInput(userParam.position, "regular") == true) {
            isUser.position = userParam.position
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
        if (validateInput(userParam.company, "regular") == true) {
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

function validateLocation(locationParam) {

    if (locationParam.name == null) {
        throw ("Location name is required")
    }

    if (locationParam.address == null) {
        throw ("Address is required")
    }

    if (locationParam.lat == null) {
        throw ("Latitude is required")
    }

    if (isNaN(locationParam.lat)) {
        throw ("Latitude must be a number")
    }

    if (locationParam.long == null) {
        throw ("Longitude is required")
    }

    if (isNaN(locationParam.long)) {
        throw ("Latitude must be a number")
    }

    if (validateInput(locationParam.name, "regular") == false) {
        throw ("Location name is invalid")
    }

    if (validateInput(locationParam.address, "regular") == false) {
        throw ("Address is invalid")
    }

    const location = {
        _id: uuidv4(),
        name: locationParam.name,
        address: locationParam.address,
        lat: locationParam.lat,
        long: locationParam.long
    }

    return location

}

function validateTask(taskParam) {

    if (taskParam.title == null) {
        throw ("Title is required")
    }

    if (taskParam.description == null) {
        throw ("Description is required")
    }

    if (taskParam.location == null) {
        throw ("Location is required")
    }

    if (taskParam.period == null) {
        throw ("Period is required")
    }

    if (validateInput(taskParam.title, "regular") == false) {
        throw ("Title is invalid")
    }

    if (validateInput(taskParam.description, "regular") == false) {
        throw ("Description is invalid")
    }

    if (validateInput(taskParam.location, "regular") == false) {
        throw ("Location is invalid")
    }

    if (validateInput(taskParam.period, "period") == false) {
        throw ("Period is invalid")
    }

    const task = {
        _id: uuidv4(),
        title: taskParam.title,
        description: taskParam.description,
        location: taskParam.location,
        period: taskParam.period
    }

    return task
}

function validateTaskUpdate(task, taskParam) {

    if (task == null) {
        throw ("Task does not exist")
    }

    if (taskParam.title != null) {
        if (validateInput(taskParam.title, "regular") == true) {
            task.title = taskParam.title
        } else {
            throw ("Title is invalid")
        }
    }

    if (taskParam.description != null) {
        if (validateInput(taskParam.description, "regular") == true) {
            task.description = taskParam.description
        } else {
            throw ("Description is invalid")
        }
    }

    if (taskParam.location != null) {
        if (validateInput(taskParam.location, "regular") == true) {
            task.location = taskParam.location
        } else {
            throw ("Location is invalid")
        }
    }

    if (taskParam.period != null) {
        if (validateInput(taskParam.period, "period") == true) {
            task.period = taskParam.period
        } else {
            throw ("Period is invalid")
        }
    }

    if (taskParam.score != null) {
        if (isNaN(taskParam.score)) {
            throw ("Score must be a number")
        }
        task.score = taskParam.score;
    }

    if (taskParam.duration != null) {
        if (isNaN(taskParam.duration)) {
            throw ("Duration must be a number")
        }
        task.duration = taskParam.duration;
    }

    return task
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
        case "regular":
            return validateRegularInput(input)
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
        case "period":
            return validatePeriod(input)
        default:
            return false
    }
}

function validateRegularInput(input) {
    //check name regex with turkish characters and space and numbers 
    var nameRegex = /^[A-Za-zÇçĞğİıÖöŞşÜü0-9- /:.!'^+%&/()=?-_;,'!]*$/;
    //validate input with regex
    return (nameRegex.test(input))
}

function validateName(input) {
    //check name regex with turkish characters

    var nameRegex = /^[A-Za-zÇçĞğİıÖöŞşÜü]+(?:\s+[A-Za-zÇçĞğİıÖöŞşÜü]+)*$/;
    //validate input with regex
    return (nameRegex.test(input))
}

function validateEmail(input) {
    //email regex
    var emailRegex = /\S+@\S+\.\S+/;
    //validate input with regex
    return (emailRegex.test(input))
}

function validatePassword(input) {
    //password regex
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    //validate input with regex
    return (passwordRegex.test(input))
}

function validateTcno(input) {
    //tcno regex
    var tcnoRegex = /^[1-9]{1}[0-9]{9}[02468]{1}$/;
    //validate input with regex
    return (tcnoRegex.test(input))
}

function validateTel(input) {
    //tel regex
    var telRegex = /^5\d{9}$/;
    //validate input with regex
    return (telRegex.test(input))
}

function validatePeriod(input) {
    //period regex
    var periodRegex = /^(\*|[0-9]{1,2})(\/[0-9]{1,2})?(\s+(\*|[0-9]{1,2})(\/[0-9]{1,2})?){4}$/;
    //validate input with regex
    return (periodRegex.test(input))
}