const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    user: { type: String, required: [true, 'UserId is required'] },
    company: { type: String, required: [true, 'Company is required'] },
    device: { type: String, required: [true, "Device is required"] },
    location: { type: String, required: [true, "Location is required"] },
    lat: { type: Number, required: [true, 'Latitude is required'] },
    long: { type: Number, required: [true, 'Longitude is required'] },
    intime: { type: Date, required: [true, 'Intime is required'] },
    outtime: { type: Date, required: false },
    closed: { type: Boolean, required: true, default: false },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Scan', schema);