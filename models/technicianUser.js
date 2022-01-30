const mongoose = require('mongoose');
const { Schema } = mongoose
const technicianUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    villageName: {
        type: String,
        required: true
    },
    taluka: {
        type: String,
        required: true
    },
    doctor: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const user = mongoose.model('technicianUserSchema', technicianUserSchema)
// user.createCollection()
// user.createIndexes()
module.exports = mongoose.model('technicianUserSchema', technicianUserSchema);