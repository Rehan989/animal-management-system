const mongoose = require('mongoose');
const { Schema } = mongoose
const bullSemenSchema = new Schema({
    bullNo:{
        type:String,
        required:true
    },
    species:{
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    noOfDoses:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const bullSemen = mongoose.model('bullSemenSchema', bullSemenSchema)
bullSemen.createCollection()
bullSemen.createIndexes()
module.exports = bullSemen;