const db = require('_helpers/db');
const { v4: uuidv4 } = require('uuid')
const security = require('_helpers/security.check');

require('dotenv').config();

const Subscription = db.Subscription;
const Company = db.Company;

module.exports = {
    createSubscription,
    getSubscription,
    updateSubscription,
};

async function createSubscription(params, payload) {
    const admin = await security.checkAdmin(payload);

    if (params.company == null) throw "Company is required";
    if (params.price == null) throw "Price is required";
    if (params.period == null) throw "Period is required";
    if (params.startTime == null) throw "Start time is required";
    if (params.endTime == null) throw "End time is required";
    if (params.renew == null) throw "Renew is required";

    const company = await db.Company.findById(params.company);

    if (company == null) throw "Company not found";

    //check price is number
    if (isNaN(params.price)) throw "Price must be number";

    //check period is number
    if (isNaN(params.period)) throw "Period must be number";

    //check endTime is bigger than startTime
    if (params.endTime < params.startTime) throw "End time must be bigger than start time";

    //check renew is boolean
    if (typeof params.renew != "boolean") throw "Renew must be boolean";

    const subscription = new Subscription({
        _id: uuidv4(),
        company: params.company,
        price: params.price,
        period: params.period,
        startTime: params.startTime,
        endTime: params.endTime,
        renew: params.renew,
        status: 1
    });

    await subscription.save();
    return subscription
}

async function getSubscription(payload) {
    const admin = await security.checkAdmin(payload);
    return await Subscription.find();
}

async function updateSubscription(params, payload) {
    const admin = await security.checkAdmin(payload);

    const subscription = await Subscription.findById(params.id);
    if (subscription == null) throw "Subscription not found";

    if (params.price != null) subscription.price = params.price;
    if (params.period != null) subscription.period = params.period;
    if (params.startTime != null) subscription.startTime = params.startTime;
    if (params.endTime != null) subscription.endTime = params.endTime;
    if (params.renew != null) subscription.renew = params.renew;
    if (params.status != null) subscription.status = params.status;

    await subscription.save();
    return subscription

}