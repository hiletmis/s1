const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: { type: String, required: true },
    company: { type: String, required: [true, 'Company is required'] },
    startTime: { type: Date, required: [true, 'startTime is required'] },
    endTime: { type: Date, required: [true, 'endTime is required'] },
    period: { type: Number, required: [true, 'period is required'] },
    renew: { type: Boolean, required: true, default: false },
    price: { type: Number, required: [true, 'price is required'] },
    status: { type: Number, required: true, default: 0 },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Subscription1', schema);