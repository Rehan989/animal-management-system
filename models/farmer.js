const mongoose = require('mongoose');
const { Schema } = mongoose
const farmerUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    animals: {
        type: Array,
        default: []
    },
    mobileNo: {
        type: String,
        unique: true
    },
    rationCard: {
        type: String,
    },
    addhar: {
        type: String,
    },
    sex: {
        type: String,
        required: true,
    },
    technicianId: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        Default: Date.now
    },
});
const farmerUser = mongoose.model('farmerUserSchema', farmerUserSchema)
farmerUser.createCollection()
farmerUser.createIndexes()
module.exports = mongoose.model('farmerUserSchema', farmerUserSchema);