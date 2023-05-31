const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')

require('dotenv').config();

const User = db.User;
const Scan = db.Scan;
const Company = db.Company;

module.exports = {
    scan,
    getScanner
};

async function scan(scanParam, payload) {
    const isUser = await User.findById(payload.sub);
    const isCompany = await Company.findById(payload.company);

    if (isUser == null) {
        throw ("The user does not exist")
    }

    if (isCompany == null) {
        throw ("The company does not exist")
    }

    const location = isCompany.locations.find(x => x._id === scanParam.location);

    if (location == null) {
        throw ("The location does not exist")
    }

    const distance = getDistanceFromLatLonInKm(scanParam.lat, scanParam.long, location.lat, location.long);

    if (distance > 0.1) {
        throw ("You are not at the company location")
    }

    //get last open scan
    const lastScan = await Scan.findOne({ user: payload.sub, closed: false }, { "__v": 0, "lat": 0, "long": 0, "device": 0 }, { sort: { 'intime': -1 } });

    if (lastScan != null) {
        // close last scan
        lastScan.outtime = new Date();
        lastScan.closed = true;

        if (Math.abs(lastScan.outtime - lastScan.intime) < 39600000) {
            await lastScan.save();
            return lastScan
        }
    }

    // save scan
    const scan = new Scan({
        _id: uuidv4(),
        user: payload.sub,
        company: payload.company,
        device: isUser.device,
        location: scanParam.location,
        lat: scanParam.lat,
        long: scanParam.long,
        intime: new Date(),
        closed: false
    });

    await scan.save();
    return scan
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

async function getScanner(payload) {
    const isUser = await User.findById(payload.sub);

    if (isUser == null) {
        throw ("The user does not exist")
    }

    return await Scan.find({ user: payload.sub }, { "__v": 0, "lat": 0, "long": 0, "device": 0 }, { sort: { 'intime': -1 } });
}