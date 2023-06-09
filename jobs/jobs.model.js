const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: [true, 'Task name is required'] },
    description: { type: String, required: false },
    company: { type: String, required: [true, 'Company is required'] },
    location: { type: String, required: [true, "Location is required"] },
    shifts: [{ type: String, required: [true, "Location is required"] }],
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', schema);