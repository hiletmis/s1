const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const security = require('_helpers/security.check');

require('dotenv').config();

const Shift = db.Shift;

module.exports = {
    createShift,
    getShifts,
    updateShift,
    deleteShift
};

async function createShift(shiftParam, payload) {
    const company = await security.checkCompany(payload.sub);
    const shift = security.validateShift(shiftParam);
    shift.company = payload.sub;
    await shift.save();
    return shift
}

async function getShifts(payload) {
    const company = await security.checkCompany(payload.sub);
    return await Shift.find({ company: payload.sub }, { "__v": 0, "company": 0 });
}

async function updateShift(shiftParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (shiftParam.shift == null) {
        throw ("Shift ID is required")
    }

    const shift = await Shift.findById({ _id: shiftParam.shift, company: payload.sub }, { "__v": 0, "company": 0 });
    const updatedShift = security.validateShiftUpdate(shift, shiftParam);

    await updatedShift.save();
    return updatedShift

}

async function deleteShift(shiftParam, payload) {
    const company = await security.checkCompany(payload.sub);

    if (shiftParam.shift == null) {
        throw ("Shift ID is required")
    }

    await Shift.deleteOne({ _id: shiftParam.shift, company: payload.sub });
    return { message: "Success" }
}