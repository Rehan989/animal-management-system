var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const docUser = require('../models/doctorUser');
const techUser = require('../models/technicianUser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const env = dotenv.config()

const JWT_SECRET = `${env.parsed['JWT_SECRET']}`;

let success = true;


// Route 1: Getting all the technicians under doctor '/api/auth/user'
router.get('/technicians/', fetchUser, async (req, res) => {
    let doctorId;
    try {
        doctorId = req.user.id;
        let users = []
        users = await techUser.find({doctor:doctorId});
        return res.send(JSON.stringify({users}))
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

module.exports = router;