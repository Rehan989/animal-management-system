const mongoose = require('mongoose');
const { Schema } = mongoose
const bullSemenSchema = new Schema({
    aiDate:{
        type:String,
        required:true
    },
    bullId:{
        type:String,
        required:true
    },
    villageName:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    fresh:{
        type:String,
        required:true
    },
    species:{
        type:String,
        required:true
    },
    pdDate:{
        type:String,
        required:true
    },
    pdResult:{
        type:String,
        required:true
    },
    pregnancyDays:{
        type:String,
        required:true
    },
    vdUserId:{
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