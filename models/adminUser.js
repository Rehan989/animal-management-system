const mongoose = require('mongoose');
const { Schema } = mongoose
const bcrypt = require('bcryptjs');

const adminUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        default:'admin'
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const adminuser = mongoose.model('adminUserSchema', adminUserSchema)
adminuser.createCollection()
adminuser.createIndexes()

const hashPass = async (password) => {
    const salt = await bcrypt.genSalt(12);
    const hashedpwd = await bcrypt.hash(password, salt);
    return hashedpwd
}

const createUser = async (email, password)=>{
    let hashedPass = await hashPass(password);
    let user = await adminuser.create({
        email: email,
        password: hashedPass
    })
}

const checkAdminUser = async ()=>{
    let user = await adminuser.findOne({email:process.env.ADMIN_USER});
    if(!user){
        createUser(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD)
    }
};

checkAdminUser();

module.exports = mongoose.model('adminUserSchema', adminUserSchema);