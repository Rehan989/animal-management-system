var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const docUser = require('../models/doctorUser');
const farmers = require('../models/farmer');
const techUser = require('../models/technicianUser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const farmer = require('../models/farmer');
const env = dotenv.config()

const JWT_SECRET = `${env.parsed['JWT_SECRET']}`;

let success = true;


// Route 1: Getting all the technicians under doctor '/api/details/doctor/technicians/'
router.get('/doctor/technicians/', fetchUser, async (req, res) => {
    let doctorId;
    try {
        doctorId = req.user.id;
        doctor = docUser.findById(doctorId)
        if (!doctor) {
            success = false
            return res.status(401).json({ error: "Access Denied", success })
        }
        let users = []
        users = await techUser.find({ doctor: doctorId });
        success = true;
        return res.send(JSON.stringify({ users, success }))
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

module.exports = router;