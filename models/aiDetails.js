const mongoose = require('mongoose');
const { Schema } = mongoose
const aiDetailsSchema = new Schema({
    freshReports: {
        type: String,
        required: true
    },
    tagNo: {
        type: String,
        required: true,
        unique: true
    },
    bullId: {
        type: String,
        required: true
    },
    animalTagNo: {
        type: String,
        required: true
    },
    technicianId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const aiDetails = mongoose.model('aiDetailsSchema', aiDetailsSchema)
aiDetails.createCollection()
aiDetails.createIndexes()
module.exports = aiDetails;