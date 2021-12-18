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


// Route 1: creating user using post request on api '/api/auth/signup'
router.post('/signup/:userType',
    [
        body('username', "Enter a valid username(length should be greater than 6 chars)").isLength({ min: 6 }),
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    ]
    , async (req, res) => {
        // If there are any validation errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false
            return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
        }
        try {
            if (req.params.userType == "doctor") {
                // extracting required details from the request's body
                let { name, hostpitalName, username, email, gender, password } = req.body;

                // validating if user with this email already exists
                let user = await docUser.findOne({ email: email })
                // validating if user with te email already exists
                if (user) {
                    success = false
                    return res.status(400).json({ error: "User with the same email already exists!", success });
                }

                // validating username
                user = await docUser.findOne({ username: username })
                // validating if user with te email already exists
                if (user) {
                    success = false
                    return res.status(400).json({ error: "User with the same username already exists!", success });
                }

                // generating salt for user
                const salt = await bcrypt.genSalt(12);
                const hashedPass = await bcrypt.hash(password, salt);

                // creating user if all the provided values are correct
                user = await docUser.create({
                    hostpitalName: hostpitalName,
                    name: name,
                    username: username,
                    password: hashedPass,
                    email: email,
                    gender: gender
                });

                const data = {
                    user: {
                        id: user.id
                    }
                }
                const authtoken = jwt.sign(data, JWT_SECRET)

                // sending jwt token as the response
                success = true
                return res.send(JSON.stringify({ authtoken: authtoken, success }))
            }
            if (req.params.userType == "technician") {
                let { name, address, education, villageName, taluka, district, doctor, username, email, gender, password } = req.body;

                // validating if user with this email already exists
                let user = await techUser.findOne({ email: email })
                // validating if user with te email already exists
                if (user) {
                    success = false
                    return res.status(400).json({ error: "User with the same email already exists!", success });
                }

                // validating username
                user = await techUser.findOne({ username: username })
                // validating if user with te email already exists
                if (user) {
                    success = false
                    return res.status(400).json({ error: "User with the same username already exists!", success });
                }

                // generating salt for user
                const salt = await bcrypt.genSalt(12);
                const hashedPass = await bcrypt.hash(password, salt);

                // creating user if all the provided values are correct
                user = await techUser.create({
                    address: address,
                    education: education,
                    villageName: villageName,
                    taluka: taluka,
                    district: district,
                    doctor: doctor,
                    name: name,
                    username: username,
                    password: hashedPass,
                    email: email,
                    gender: gender
                });

                const data = {
                    user: {
                        id: user.id
                    }
                }
                const authtoken = jwt.sign(data, JWT_SECRET)

                // sending jwt token as the response
                success = true
                return res.send(JSON.stringify({ authtoken: authtoken, success }))
            }
            if (req.params.userType !== "doctor" || req.params.userType !== "technician") {
                success = false
                return res.status(404).json({ error: "404 not found", success });
            }

        } catch (error) {
            console.log(error);
            success = false
            return res.status(500).json({ error: "Internal servor error!", success })
        }
    });


// Route 2: logging user using post request on api '/api/auth/signup'
router.post('/login/:userType', [
    body('username', "Enter a valid username(length should be greater than 6 chars)").isLength({ min: 6 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
]
    ,
    async (req, res) => {
        // If there are any validation errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            success = false
            return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
        }
        try {
            // extracting required values from the request's body(req.bdoy)
            const { username, password } = req.body;
            // checking user if it exists or not
            let user = NaN;
            if (req.params.userType === "doctor")
                user = await docUser.findOne({ username: username });
            else if (req.params.userType === "technician") {
                user = await techUser.findOne({ username: username });
            }
            else {
                console.log(req.params.userType)
                return res.status(404).json({ error: "404 not found" });
            }
            if (!user) {
                success = false
                return res.status(400).json({ error: "Invalid Credentials!", success });
            }
            // comparing the hashed and the password to verify that the given password is correct or not
            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                success = false
                return res.status(400).json({ error: "Invalid credentials!", success });
            }
            // creating auth-token if all the credentials are good
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true
            return res.send(JSON.stringify({ authtoken: authtoken, success }));
        }
        catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal servor error! please try again later!", success })
        }
    });

// Route 3: Getting user Credentials '/api/auth/user'
router.post('/user/:userType', fetchUser, async (req, res) => {
    let userId;
    try {
        userId = req.user.id;
        let user = NaN;
        if (req.params.userType === "doctor")
            user = await docUser.findById(userId).select("-password")
        else if (req.params.userType === "technician")
            user = await techUser.findById(userId).select("-password")
        else {
            return res.status(404).json({ error: "404 not found" });
        }
        if (!user) {
            return res.status(401).json({ error: 'User not found!' })
        }
        return res.send(user)
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})
module.exports = router;