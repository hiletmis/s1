const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    title: { type: String, required: [true, 'Task name is required'] },
    description: { type: String, required: false },
    company: { type: String, required: [true, 'Company is required'] },
    location: { type: String, required: [true, "Location is required"] },
    startTime: { type: String, required: [true, "Start time is required"] },
    endTime: { type: String, required: [true, "End time is required"] },
    tasks: [{
        _id: { type: String, required: true },
        title: { type: String, required: [true, 'Task name is required'] },
        description: { type: String, required: false },
        score: { type: Number, required: false, default: 0 },
        status: { type: Number, required: true, default: 0 },
        createdDate: { type: Date, default: Date.now }
    }],
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Shift', schema);