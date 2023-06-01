const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const queryCheck = require('_helpers/query.check');
const security = require('_helpers/security.check');

require('dotenv').config();

const User = db.User;
const Scan = db.Scan;
const Company = db.Company;

module.exports = {
    scan,
    getScanner,
    getAggSearch
};

async function scan(scanParam, payload) {
    const isUser = await security.getUser(payload.sub);
    const location = await security.checkLocation(payload.company, scanParam.location);
    security.checkDistanceFromLatLonInKm(scanParam.lat, scanParam.long, location.lat, location.long);

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

async function getScanner(payload) {
    const isUser = await security.getUser(payload.sub);
    const locations = await security.checkLocation(payload.company);

    const scans = await Scan.find({ user: payload.sub }, { "__v": 0, "lat": 0, "long": 0, "device": 0 }, { sort: { 'intime': -1 } });
    return { locations, scans }
}

async function getAggSearch(params, payload) {
    const isUser = await security.getUser(payload.sub)
    const locations = await security.checkLocation(payload.company);

    const query = queryCheck.queryBuilder(params, { company: payload.company });
    const scans = await Scan.find(query, { "__v": 0, "lat": 0, "long": 0, "device": 0 }, { sort: { 'intime': -1 } });
    return { locations, scans }
}