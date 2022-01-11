const mongoose = require('mongoose');
const { Schema } = mongoose
const bullSemenSchema = new Schema({
    tagNo:{
        type:String,
        required:true
    },
    bullId:{
        type:String,
        required:true
    },
    bullNo:{
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