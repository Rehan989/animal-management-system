const mongoose = require('mongoose');
const { Schema } = mongoose
const bullSemenSchema = new Schema({
    bullNo: {
        type: String,
        required: true,
        unique: true
    },
    bullId: {
        type: String,
        required: true,
        unique: true
    },
    species: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    noOfDoses: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
});
const bullSemen = mongoose.model('bullSemenSchema', bullSemenSchema)
bullSemen.createCollection()
bullSemen.createIndexes()
module.exports = bullSemen;