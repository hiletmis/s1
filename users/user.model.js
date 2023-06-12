const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: [true, 'Email is required'] },
    hash: { type: String, required: [true, 'Password is required'] },
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    tcno: { type: String, required: false },
    tel: { type: Number, required: false },
    mail: { type: String, required: false },
    company: { type: String, required: true, validate: { validator: function(v) { return v != null }, message: 'Company is required' } },
    office: { type: String, required: false },
    userRole: { type: Number, required: true, default: 0 },
    position: { type: String, required: false },
    job: { type: String, required: false },
    department: { type: String, required: false },
    status: { type: Number, required: true, default: 0 },
    photo: { data: Buffer, contentType: String },
    currentShift: { type: String, required: false },
    device: { type: String, required: true, default: "mobile" },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);