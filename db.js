const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://rehan989:rehan8766@cluster0.bwtgh.mongodb.net/data";

const connectMongodb = () => {
    mongoose.connect(mongoUri, () => {
        console.log("MongoDb connection successfull")
    })
}
module.exports = connectMongodb;