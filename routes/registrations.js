var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const farmer = require('../models/farmer')
const techUser = require('../models/technicianUser');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const animal = require('../models/animal');
const bullSemenAccount = require('../models/bullSemen');
const ObjectId = require('mongoose').Types.ObjectId;
  
// Validator function
function isValidObjectId(id){
      
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
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
    body('village', 'Please specify a village').isLength({min:1}),
    body('sex', 'Please specify a gender').isLength({min:1}),
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
        let farmerUser = await farmer.find({'rationCard':rationCard});
        if(farmerUser.length>0){
            success = false;
            return res.status(400).json({ error: "Farmer withthe same ration card already exists", success });
        }
        farmerUser = await farmer.find({'addhar':addhar});
        if(farmerUser.length>0){
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


// Route 2: Creating animals '/api/register/animal'
router.post('/animal/',
[
    body('farmerId', 'Please provide a valid farmer id').isLength({min:1}),
    body('species', 'Please specify species of the animal').isLength({min:1}),
    body('breed', 'Please specify a breed').isLength({min:1}),
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
        if(!isValidObjectId(farmerId)){
            success = false
            return res.status(400).json({error:"Invalid farmer id", success});
        }

        let farmerUser = await farmer.findById(farmerId)
        if(!farmerUser){
            success = false
            return res.send(401).json({error:"Farmer Not found", success})
        }

        
        let farmersAnimal = await animal.create({ farmerId:farmerId, species:species, breed:breed, age:age, noOfCalvings:noOfCalvings })
        
        success = true;
        return res.status(204).json({ error: "Farmer Created", success });
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
    body('species', 'Please specify species of the animal').isLength({min:1}),
    body('breed', 'Please specify a breed').isLength({min:1}),
    body('doses', 'Enter a valid no. of doses').isNumeric()
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
        let { bullNo, species, breed, doses } = req.body;
        if(!technician){
            success = false
            return res.status(401).json({error:"Access Denied", success})
        }
        bullSemen = await bullSemenAccount.create({ bullNo:bullNo, species:species, breed:breed, noOfDoses:doses })
        
        success = true;
        return res.status(204).json({ error: "Bull semen Created", success });
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
});

module.exports = router;