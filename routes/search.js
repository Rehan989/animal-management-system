var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const doctorUser = require('../models/doctorUser');
const farmer = require('../models/farmer');
const animal = require('../models/animal');
const aiDetails = require('../models/aiDetails');
const pdDetails = require('../models/pregnancyDetails');
const bullAccount = require('../models/bullSemen')
let success = false;


// Route 1: Getting doctor with his name '/api/search/doctor'
router.get('/doctor', fetchUser, async (req, res) => {
    let doctorName = "", doctorEmail = "";
    try {
        doctorName = req.query.name;
        doctorEmail = req.query.email;
        // If there are any validation errors, return Bad request and the errors
        if (doctorName) {
            if (doctorName.length <= 3) {
                success = false
                return res.status(422).json({ error: "Doctor name should be of 3 or more characters!", success })
            }

            let doctors = await doctorUser.find({
                name: {
                    $regex: new RegExp(doctorName, 'i'),
                }
            },
                {
                    _id: 0
                }
            ).limit(5).select('-password')
            success = true;
            return res.send(JSON.stringify({ doctors, success }))
        }
        else if (doctorEmail) {
            let doctor = await doctorUser.findOne({ email: doctorEmail }).select('-password');
            success = true
            return res.send(JSON.stringify({ doctor, success }))
        }
        else {
            success = false
            return res.status(422).json({ error: "Invalid search query!", success })
        }
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})


// Route 2: Getting Farmer with his name '/api/search/farmer/:farmerName/'
router.get('/farmer', fetchUser, async (req, res) => {
    let farmerName = "", animalTagNo = '', farmerPhone = "";
    try {
        farmerName = req.query.name;
        farmerPhone = req.query.phone;
        animalTagNo = req.query.animaltagno;

        let technicianId = req.user.id;
        if (farmerName) {
            // If there are any validation errors, return Bad request and the errors
            if (farmerName.length <= 3) {
                success = false
                return res.status(422).json({ error: "Farmer name should be of 3 or more characters!", success })
            }


            let farmers = await farmer.find({
                name: {
                    $regex: new RegExp(farmerName, 'i'),
                },
                technicianId: technicianId
            },
                {
                    _id: 0
                }
            ).limit(5).select('-password')
            for (let i = 0; i < farmers.length; i++) {
                let anml = await animal.find({ farmerId: farmers[i].mobileNo, technicianId: technicianId });
                farmers[i].animals = anml;
            }
            success = true;
            return res.send(JSON.stringify({ farmers, success }))
        }
        else if (farmerPhone) {
            // If there are any validation errors, return Bad request and the errors
            if (farmerPhone.length < 10) {
                success = false
                return res.status(422).json({ error: "Phone number should be of 10 numbers!", success })
            }

            let farmerUser = await farmer.findOne({ mobileNo: farmerPhone, technicianId: technicianId }).select('-password')
            success = true;
            return res.send(JSON.stringify({ farmerUser, success }))
        }
        else if (animalTagNo) {
            // If there are any validation errors, return Bad request and the errors
            let animalData = await animal.findOne({ tagNo: animalTagNo });
            if (!animalData) {
                success = false
                return res.status(422).json({ error: "No animal found with the following animal tag number!", success })
            }

            let farmerUser = await farmer.findOne({ animals: animalData._id, technicianId: technicianId }).select('-password')

            let anml = await animal.find({ farmerId: farmerUser.mobileNo, technicianId: technicianId });
            farmerUser.animals = anml;
            success = true;

            return res.send(JSON.stringify({ farmers: [farmerUser], success }))
        }
        else {
            success = false
            return res.status(422).json({ error: "Invalid search query!", success })
        }
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 3: Getting Animals with their id '/api/search/animals/:farmerPhone/'
router.get('/animals', fetchUser, async (req, res) => {
    let mobileNo = "", tagNo = "";
    try {
        mobileNo = req.query.farmerid;
        tagNo = req.query.tagno;
        let technicianId = req.user.id;
        if (mobileNo) {
            let farmerUser = await farmer.findOne({
                mobileNo,
                technicianId: technicianId
            })
            if (!farmerUser) {
                success = false
                return res.status(422).json({ error: "Farmer not found!", success })
            }
            let animals = await animal.find({
                farmerId: mobileNo,
                technicianId: technicianId
            })
            success = true
            return res.send(JSON.stringify({ animals, success }))
        }
        else if (tagNo) {

            let animals = await animal.findOne({
                tagNo: tagNo,
                technicianId: technicianId
            })

            if (animals) {
                // let anml = await animal.find({ farmerId: animals.farmerId, technicianId: technicianId });

                // animals.farmer = await farmer.findOne({ mobileNo: animals.farmerId })
                // animals.farmer.animals = anml;
                success = true;
            }
            else {
                success = false
                animals = [];
            }
            return res.send(JSON.stringify({ animals, success }))
        }
        else {
            success = false
            return res.status(422).json({ error: "Invalid search query!", success })
        }
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 4: Getting ai details with the tag number field '/api/search/aidetails/:/'
router.get('/aidetails', fetchUser, async (req, res) => {
    let technicianId = req.user.id;
    try {
        let animalTagNo = req.query.tagno;
        let aidetails = await aiDetails.findOne({ animalTagNo: animalTagNo, technicianId: technicianId })

        success = true;
        return res.send(JSON.stringify({ aidetails, success }))

    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 5: Getting bull id with the tag number of technician '/api/search/bullid/'
router.get('/bull', fetchUser, async (req, res) => {
    let technicianId = req.user.id;
    try {
        let bullAccounts = await bullAccount.find({ technicianId: technicianId })

        success = true;
        return res.send(JSON.stringify({ bullAccounts, success }))

    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})


// Route 6: Getting pd details with the tag number field '/api/search/pdDetails/:/'
// router.get('/pdDetails/:tagno', fetchUser, async (req, res) => {
//     let technicianId = req.user.id;
//     try {
//         let tagNo = req.params.tagno;
//         let pregnancyDetails = await pdDetails.findOne({ tagNo: tagNo, technicianId: technicianId })

//         success = true;
//         return res.send(JSON.stringify({ pregnancyDetails, success }))

//     } catch (error) {
//         console.error(error.message);
//         success = false
//         return res.status(500).json({ error: "Internal Server Error", success });
//     }
// })
module.exports = router;