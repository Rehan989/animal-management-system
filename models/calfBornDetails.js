const mongoose = require('mongoose');
const { Schema } = mongoose
const calfBornSchema = new Schema({
    sex:{
        type:String,
        required:true
    },
    easeOfCalvings:{
        type:String,
        required:true
    },
    bullId:{
        type:String,
        required:true
    },
    tagNo:{
        type:String,
        required:true
    },
    doses:{
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    species:{
        type:String,
        required:true
    },
    gestationDays:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },
    village:{
        type:String,
        required:true
    },
    fresh:{
        type:String,
        required:true
    },
    aiDate:{
        type:String,
        required:true
    },
    pdDate:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const calfBorn = mongoose.model('Calf Born details', calfBornSchema)
calfBorn.createCollection()
calfBorn.createIndexes()
module.exports = calfBorn;