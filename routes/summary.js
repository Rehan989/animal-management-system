var express = require('express')
var router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const doctorUser = require('../models/doctorUser');
const farmer = require('../models/farmer');
const animal = require('../models/animal');
const aiDetails = require('../models/aiDetails');
const pdDetails = require('../models/pregnancyDetails');
const bullAccount = require('../models/bullSemen');
const calfBornDetail = require('../models/calfBornDetails');
let success = false;

// Route 1: Getting summary for ai at '/api/summary/ai/'
router.get('/ai', fetchUser, async (req, res) => {
    let technicianId = req.user.id;
    let village = req.query.village;
    let periodFrom = req.query.periodfrom;
    let periodTo = req.query.periodto;
    try {
        let aiFreshCounts = await aiDetails.find({ technicianId: technicianId, freshReports: "fresh", village: village }).count();
        let aiR1Counts = await aiDetails.find({ technicianId: technicianId, freshReports: "repeat-r1", village: village }).count();
        let aiR2Counts = await aiDetails.find({ technicianId: technicianId, freshReports: "repeat-r2", village: village }).count();

        success = true;
        return res.send(JSON.stringify({ freshCounts: aiFreshCounts, r1Counts: aiR1Counts, r2Counts: aiR2Counts, success }))

    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 2: Getting summary for ai at '/api/summary/pd/'
router.get('/pd', fetchUser, async (req, res) => {
    let technicianId = req.user.id;
    let village = req.query.village;
    let periodFrom = req.query.periodfrom;
    let periodTo = req.query.periodto;
    try {
        let pdPregnantCount = await pdDetails.find({ technicianId: technicianId, pdResult: 'pregnant', village }).count();
        let pdNonPregnantCount = await pdDetails.find({ technicianId: technicianId, pdResult: 'non-pregnant', village }).count();

        success = true;
        return res.send(JSON.stringify({ pregnantCounts: pdPregnantCount, nonPregnantCounts: pdNonPregnantCount, success }))

    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 2: Getting summary for ai at '/api/summary/calf-born/'
router.get('/calf-born', fetchUser, async (req, res) => {
    let technicianId = req.user.id;
    let village = req.query.village;
    let periodFrom = req.query.periodfrom;
    let periodTo = req.query.periodto;
    try {
        let calfBornMaleCount = await calfBornDetail.find({ technicianId: technicianId, pdResult: 'male', village }).count();
        let calfBornFeMaleCount = await calfBornDetail.find({ technicianId: technicianId, pdResult: 'female', village }).count();

        success = true;
        return res.send(JSON.stringify({ maleCounts: calfBornMaleCount, femaleCounts: calfBornFeMaleCount, success }))

    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})


module.exports = router;