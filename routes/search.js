var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const doctorUser = require('../models/doctorUser');
const farmer = require('../models/farmer');
let success = false;

// Route 1: Getting doctor with his name '/api/search/doctor/:doctorName/'
router.get('/doctor/:doctorName/', fetchUser, async (req, res) => {
    let doctorName = "";
    try {
        doctorName = req.params.doctorName;
        // If there are any validation errors, return Bad request and the errors
        if (doctorName.length <= 3) {
            success = false
            return res.status(422).json({ error: "Doctor name should be of 3 or more characters!", success })
        }

        let doctors = await doctorUser.find({
            name: {
                $regex: new RegExp(doctorName)
            }
        },
            {
                _id: 0
            }
        ).limit(5).select('-password')
        success = true;
        return res.send(JSON.stringify({ doctors, success }))
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})


// Route 2: Getting Farmer with his name '/api/search/farmer/:farmerName/'
router.get('/farmer/:farmerName/', fetchUser, async (req, res) => {
    let doctorName = "";
    try {
        farmerName = req.params.farmerName;
        // If there are any validation errors, return Bad request and the errors
        if (farmerName.length <= 3) {
            success = false
            return res.status(422).json({ error: "Doctor name should be of 3 or more characters!", success })
        }

        let farmers = await farmer.find({
            name: {
                $regex: new RegExp(farmerName)
            }
        },
            {
                _id: 0
            }
        ).limit(5).select('-password')
        success = true;
        return res.send(JSON.stringify({ farmers, success }))
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

module.exports = router;