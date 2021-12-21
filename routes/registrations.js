var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const farmer = require('../models/farmer')
const techUser = require('../models/technicianUser');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv')
const env = dotenv.config()

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


        let techUserId = req.user.id;
        let technician = await techUser.findById(techUserId)
        let { name, village, mobileNo, rationCard, addhar, sex } = req.body;
        if(!technician){
            success = false
            return res.status(401).json({error:"User not found!", success})
        }
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

module.exports = router;