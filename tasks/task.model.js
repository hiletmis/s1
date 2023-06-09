const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: [true, 'Task name is required'] },
    description: { type: String, required: false },
    company: { type: String, required: [true, 'Company is required'] },
    location: { type: String, required: [true, "Location is required"] },
    period: { type: String, required: [true, "Period is required"] },
    duration: { type: Number, required: false, default: 30 },
    type: { type: Number, required: true, default: 0 }, // 0: Routine; 1: Shift based; 2: unscheduled
    score: { type: Number, required: false, default: 0 },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', schema);