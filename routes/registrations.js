var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const farmer = require('../models/farmer')
const calfBorn = require('../models/calfBornDetails')
const techUser = require('../models/technicianUser');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const animal = require('../models/animal');
const bullSemenAccount = require('../models/bullSemen');
const pregnancyDetails = require('../models/pregnancyDetails');
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


// Route 1: Creating farmer '/api/register/farmer' test remaining
router.post('/farmer/',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('village', 'Please specify a village').isLength({ min: 1 }),
        body('sex', 'Please specify a gender').isLength({ min: 1 }),
        body('name', 'Enter a valid name').isLength({ min: 3 }),
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
                return res.status(400).json({ error: "Farmer withthe same ration card already exists", success });
            }
            farmerUser = await farmer.find({ 'addhar': addhar });
            if (farmerUser.length > 0) {
                success = false;
                return res.status(400).json({ error: "Farmer withthe same addhar card already exists", success });
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


// Route 2: Creating animals '/api/register/animal' test remaining test remaining
router.post('/animal/',
    [
        body('farmerId', 'Please provide a valid farmer id').isLength({ min: 1 }),
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

            let { farmerId, species, breed, age, noOfCalvings } = req.body;
            if (!isValidObjectId(farmerId)) {
                success = false
                return res.status(400).json({ error: "Invalid farmer id", success });
            }

            let farmerUser = await farmer.findById(farmerId)
            if (!farmerUser) {
                success = false
                return res.send(401).json({ error: "Farmer Not found", success })
            }


            let farmersAnimal = await animal.create({ farmerId: farmerId, species: species, breed: breed, age: age, noOfCalvings: noOfCalvings })

            success = true;
            return res.status(204).json({ error: "Farmer Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });


// Route 3: Creating bull semen accounts '/api/register/bullsemen/' test remaining
router.post('/bullsemen/',
    [
        body('bullNo', 'Please provide a valid bull no').isLength({ min: 3 }),
        body('bullId', 'Please provide a valid bull id').isLength({ min: 3 }),
        body('species', 'Please specify species of the animal').isLength({ min: 1 }),
        body('breed', 'Please specify a breed').isLength({ min: 1 }),
        body('doses', 'Enter a valid no. of doses').isNumeric()
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }
            let { bullNo, bullId, species, breed, doses } = req.body;
            let bullSemen = await bullSemenAccount.create({ bullNo: bullNo, bullId: bullId, species: species, breed: breed, noOfDoses: doses })

            success = true;
            return res.status(204).json({ error: "Bull semen Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });


// Route 4: Creating calf born details '/api/register/calf/' test remaining
router.post('/calf/',
    [
        body('sex', 'Please provide a gender').isLength({ min: 1 }),
        body('easeOfCalvings', 'Please provide the value easeOfCalvings').isLength({ min: 1 }),
        body('bullId', 'Please provide a valid bull id').isLength({ min: 3 }),
        body('tagNo', 'Please provide a valid tag no').isLength({ min: 3 }),
        body('breed', 'Please specify a breed').isLength({ min: 1 }),
        body('gestationDays', 'Please specify the valid gestationDays').isLength({ min: 1 }),
        body('owner', 'Please specify a owner ').isLength({ min: 1 }),
        body('village', 'Please specify a village ').isLength({ min: 1 }),
        body('fresh', 'Please specify a fresh ').isLength({ min: 1 }),
        body('species', 'Please specify species of the animal').isLength({ min: 1 }),
        body('doses', 'Enter a valid no. of doses').isNumeric(),
        body('aiDate', 'Enter a valid date').isDate(),
        body('pdDate', 'Enter a valid no. of doses').isDate()
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }
            let { sex, easeOfCalvings, bullId, tagNo, breed, gestationDays, owner, village, fresh, species, doses, aiDate, pdDate } = req.body;

            let bull = await bullSemenAccount.findOne({ bullId: bullId });
            if (!bull) {
                success = false
                return res.status(400).json({ error: "Bull semen with the provided id not found" });
            }
            let bullSemen = await calfBorn.create({ sex: sex, easeOfCalvings: easeOfCalvings, bullId: bullId, tagNo: tagNo, breed: breed, gestationDays: gestationDays, owner: owner, village: village, fresh: fresh, species: species, doses: doses, aiDate, pdDate: pdDate })

            success = true;
            return res.status(204).json({ error: "Calf born details Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });


// Route 5: Creating artificial insemination details '/api/register/ai/' test remaining
router.post('/ai/',
    [
        body('bullId', 'Please provide a valid bull id').isLength({ min: 3 }),
        body('bullNo', 'Please provide a valid bull id').isLength({ min: 3 }),
        body('tagNo', 'Please provide a valid tag no').isLength({ min: 3 }),
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }
            let { bullId, bullNo, tagNo } = req.body;
            let bull = await bullSemenAccount.findOne({ bullId: bullId, bullNo: bullNo })
            if (!bull) {
                success = false
                return res.status(400).json({ error: "Bull with the provided details do not exists", success });
            }

            let bullSemen = await bullSemenAccount.create({ bullId: bullId, tagNo: tagNo, bullNo: bullNo })

            success = true;
            return res.status(204).json({ error: "Calf born details Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });


// Route 6: Creating pregnancy details '/api/register/pregnancy/' test remaining
router.post('/pregnancy/',
    [
        body('aiDate', 'Please provide a valid ai Date').isDate(),
        body('bullId', 'Please provide a valid bull id').isLength({ min: 3 }),
        body('villageName', 'Please provide a valid village name').isLength({ min: 1 }),
        body('ownerName', 'Please provide a valid owner name').isLength({ min: 1 }),
        body('breed', 'Please provide a valid breed').isLength({ min: 1 }),
        body('fresh', 'Please provide a valid fresh').isLength({ min: 1 }),
        body('species', 'Please provide a valid species').isLength({ min: 1 }),
        body('pdDate', 'Please provide a valid species').isDate(),
        body('pdResult', 'Please provide a valid pregnancy result').isLength({ min: 1 }),
        body('pregnancyDays', 'Please provide a valid pregnancy days').isNumeric(),
        body('vdUserId', 'Please provide a valid tag no').isLength({ min: 3 })
    ],
    fetchUser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                success = false
                return res.status(400).json({ errors: errors.array(), error: "Validation Error!", success });
            }
            let { aiDate, bullId, villageName, ownerName, breed, fresh, species, pdDate, pdResult, pregnancyDays, vdUserId } = req.body;
            let bull = await bullSemenAccount.findOne({ bullId: bullId })
            if (!bull) {
                success = false
                return res.status(400).json({ error: "Bull with the provided details do not exists", success });
            }

            let pregnancyDetail = await pregnancyDetails.create({ aiDate: aiDate, ibullId: bullId, villageName: villageName, ownerName: ownerName, breed: breed, fresh: fresh, species: species, pdDate: pdDate, pdResult: pdResult, pregnancyDays: pregnancyDays, vdUserId: vdUserId })

            success = true;
            return res.status(204).json({ error: "Pregnancy details Created", success });
        } catch (error) {
            console.error(error.message);
            success = false
            return res.status(500).json({ error: "Internal Server Error", success });
        }
    });

module.exports = router;