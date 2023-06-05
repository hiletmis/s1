const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: [true, 'Email is required'] },
    hash: { type: String, required: [true, 'Password is required'] },
    companyname: { type: String, required: [true, 'Company name is required'] },
    taxNo: { type: String, required: false },
    taxOffice: { type: String, required: false },
    city: { type: String, required: false },
    town: { type: String, required: false },
    mobile: { type: String, required: false },
    fax: { type: String, required: false },
    country: { type: String, required: false },
    postalCode: { type: String, required: false },
    address: { type: String, required: false },
    locations: [{
        _id: { type: String, required: true },
        name: { type: String, required: [true, 'Location name is required'] },
        address: { type: String, required: [true, 'Address is required'] },
        lat: { type: Number, required: [true, 'Latitude is required'] },
        long: { type: Number, required: [true, 'Longitude is required'] },
    }],
    status: { type: Number, required: true, default: 0 },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Company', schema);