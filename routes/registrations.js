var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const farmer = require('../models/farmer')
const techUser = require('../models/technicianUser');
const animal = require('../models/animal');
const bullSemenAccount = require('../models/bullSemen');
const aiDetails = require('../models/aiDetails');
const pregnancyDetail = require('../models/pregnancyDetails')
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
function isValidObjectId(id) {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}


let success = true;


// Route 1: Creating farmer '/api/register/farmer'
router.post('/farmer/',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('village', 'Please specify a village').isLength({ min: 1 }),
        body('sex', 'Please specify a gender').isLength({ min: 1 }),
        body('mobileNo', 'Enter a valid mobile no').isLength({ min: 10 }),
        body('rationCard', 'Enter a valid ration card no').isLength({ min: 10 }),
        body('addhar', 'Enter a valid addhar no').isLength({ min: 12 }),
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }

            let { name, village, mobileNo, rationCard, addhar, sex } = req.body;
            let farmerUser = await farmer.find({ 'rationCard': rationCard });
            if (farmerUser.length > 0) {
                success = false;
                return res.status(400).json({ error: "Farmer with the same ration card already exists", success });
            }
            farmerUser = await farmer.find({ 'addhar': addhar });
            if (farmerUser.length > 0) {
                success = false;
                return res.status(400).json({ error: "Farmer with the same addhar card already exists", success });
            }
            farmerUser = await farmer.find({ 'mobileNo': mobileNo });
            if (farmerUser.length > 0) {
                success = false;
                return res.status(400).json({ error: "Farmer with the same phone number already exists", success });
            }

            farmerUser = await farmer.create({ name: name, village: village, mobileNo: mobileNo, rationCard: rationCard, addhar: addhar, sex: sex })

            success = true;
            return res.status(204).json({ error: "Farmer Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    })


// Route 2: Creating animals '/api/register/animal'
router.post('/animal/',
    [
        body('farmerId', 'Please provide a valid farmer id').isLength({ min: 1 }),
        body('tagNo', 'Please provide a valid farmer id').isLength({ min: 1 }),
        body('species', 'Please specify species of the animal').isLength({ min: 1 }),
        body('breed', 'Please specify a breed').isLength({ min: 1 }),
        body('age', 'Enter a valid age').isNumeric(),
        body('noOfCalvings', 'Enter a valid no. of calvings').isNumeric(),
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }

            let { farmerId, tagNo, species, breed, age, noOfCalvings } = req.body;

            let farmerAnimal = await animal.findOne({ tagNo: tagNo });
            if (farmerAnimal) {
                success = false
                return res.status(401).json({ error: "Animal with the same tag number already exists", success })
            }

            let farmerUser = await farmer.findOne({ mobileNo: farmerId })
            if (!farmerUser) {
                success = false
                return res.status(401).json({ error: "Farmer Not found", success })
            }


            let farmersAnimal = await animal.create({ tagNo: tagNo, farmerId: farmerId, species: species, breed: breed, age: age, noOfCalvings: noOfCalvings })

            farmerUser = await farmer.findByIdAndUpdate(farmerUser._id, { $set: { animals: [...farmerUser.animals, farmersAnimal._id] } })
            success = true;
            return res.status(204).json({ error: "Animal created!", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });


// Route 3: Creating bull semen accounts '/api/register/bullsemen/'
router.post('/bullsemen/',
    [
        body('bullNo', 'Please provide a valid bull no').isNumeric(),
        body('bullId', 'Please provide a valid bull id').isNumeric(),
        body('species', 'Please specify species of the animal').isLength({ min: 1 }),
        body('breed', 'Please specify a breed').isLength({ min: 1 }),
        body('noOfDoses', 'Enter a valid no. of doses').isNumeric()
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }

            let techUserId = req.user.id;
            let technician = await techUser.findById(techUserId)
            if (!technician) {
                success = false
                return res.status(401).json({ error: "Access Denied", success })
            }

            let { bullNo, bullId, date, species, breed, noOfDoses } = req.body;

            let bullSemen = await bullSemenAccount.findOne({
                bullNo: bullNo
            })
            if (bullSemen) {
                success = false
                return res.status(422).json({ error: "User with the same bull number already exists!", success })
            }

            bullSemen = await bullSemenAccount.findOne({
                bullId: bullId
            })

            if (bullSemen) {
                success = false
                return res.status(422).json({ error: "User with the same bull id already exists!", success })
            }

            bullSemen = await bullSemenAccount.create({ bullNo: bullNo, species: species, breed: breed, noOfDoses: noOfDoses, date: date, bullId: bullId })

            success = true;
            return res.status(204).json({ error: "Bull semen Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });

// Route 4: Creating ai details at '/api/register/aidetails'
router.post('/aidetails/',
    [
        body('bullId', 'Enter a bull id').isNumeric(),
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }

            let { bullId, date, freshReports } = req.body;

            let bullSemen = await bullSemenAccount.findOne({ bullId: bullId })
            if (!bullSemen) {
                success = false;
                return res.status(422).json({ error: "Bull semen account with the specific id not found!", success });
            }

            let aidetails = await aiDetails.create({
                bullId: bullId,
                date: date,
                freshReports: freshReports
            });

            success = true;
            return res.status(204).json({ error: "Ai details Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    })

// Route 4: Creating ai details at '/api/register/aidetails'
router.post('/pd/',
    [
        body('animalTagNo', 'Tag number should be a integer field!').isNumeric(),
        body('bullId', 'Bull id should be a integer field!').isNumeric()
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }

            let { animalTagNo,
                bullId,
                villageName,
                ownerName,
                aiDate,
                breed,
                species,
                freshReports,
                pdDate,
                pdResult,
                pregnancyDays,
                doctorName,
                tagNo } = req.body;

            let pdDetails = await pregnancyDetail.create({
                animalTagNo,
                bullId,
                villageName,
                ownerName,
                aiDate,
                breed,
                species,
                freshReports,
                pdDate,
                pdResult,
                pregnancyDays,
                tagNo,
                vdUserId: doctorName
            });

            success = true;
            return res.status(204).json({ error: "PD details Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    })


module.exports = router;