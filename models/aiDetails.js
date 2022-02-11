const mongoose = require('mongoose');
const { Schema } = mongoose
const aiDetailsSchema = new Schema({
    freshReports: {
        type: String,
        required: true
    },
    bullId: {
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