const mongoose = require('mongoose');
const { Schema } = mongoose
const animalSchema = new Schema({
    farmerId: {
        type: String,
        required: true
    },
    tagNo: {
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
    age: {
        type: String,
        required: true
    },
    noOfCalvings: {
        type: Number,
        required: true
    },
    aiEntries: {
        type: Array
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
const animal = mongoose.model('animalSchema', animalSchema)
animal.createCollection()
animal.createIndexes()
module.exports = animal;