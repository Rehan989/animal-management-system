const mongoose = require('mongoose');
const { Schema } = mongoose
const doctorUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    technicians: {
        type: Array,
        default:[]
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
const doctorUser = mongoose.model('doctorUserSchema', doctorUserSchema)
// doctorUser.createCollection()
// doctorUser.createIndexes()
module.exports = mongoose.model('doctorUserSchema', doctorUserSchema);