const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    task: { type: String, required: [true, 'Task name is required'] },
    performedby: { type: String, required: false },
    company: { type: String, required: [true, 'Company is required'] },
    location: { type: String, required: [true, "Location is required"] },
    due_date: { type: Date, required: false },
    note: { type: String, required: false },
    status: { type: Number, required: true, default: 0 },
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Daily', schema);