const mongoose = require('mongoose');
const { Schema } = mongoose
const calfBornDetailSchema = new Schema({
    sex: {
        type: String,
        required: true
    },
    easeOfCalvings: {
        type: String,
        required: true
    },
    animalTagNo: {
        type: String,
        required: true
    },
    tagNo: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    gestationDays: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    fresh: {
        type: String,
        required: true
    },
    aiDate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    technicianId: {
        type: String,
        required: true
    },
});
const calfBornDetail = mongoose.model('calfBornDetailSchema', calfBornDetailSchema)
calfBornDetail.createCollection()
calfBornDetail.createIndexes()
module.exports = calfBornDetail;