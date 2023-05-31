const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid')

const schema = new Schema({
    _id: { type: String, default: uuidv4(), required: true },
    ip: { type: String, required: true },
    x_real_ip: { type: String, required: true },
    cf_connecting_ip: { type: String, required: true },
    host: { type: String, required: false },
    userAgent: { type: String, required: false },
    user: { type: String, required: false },
    userRole: { type: String, required: false },
    method: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    cf_ipcountry: { type: String, required: false },
    originalUrl: { type: String, required: false },
    logLevel: { type: String, default: "LOG", required: false },
    remarks: { type: String, required: false },
    client: { type: String, required: false },
    signature: { type: String, required: false }
})

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('LogEndpoint', schema);