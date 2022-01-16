const mongoose = require('mongoose');
const { Schema } = mongoose
const aiDetails = new Schema({
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
const aiDetail = mongoose.model('aiDetails', aiDetails)
aiDetail.createCollection()
aiDetail.createIndexes()
module.exports = aiDetail;