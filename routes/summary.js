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
        let aiFreshCounts = [], aiR1Counts = [], aiR2Counts = [];
        let details = await aiDetails.find({ technicianId: technicianId });

        for (let i = 0; i < details.length; i++) {
            if (periodFrom && periodTo) {
                periodFrom = new Date(req.query.periodfrom);
                periodTo = new Date(req.query.periodto);
                if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                    continue
            }

            let anml = await animal.findOne({ tagNo: details[i].animalTagNo })
            let farmerUser;
            if (village)
                farmerUser = await farmer.findOne({ mobileNo: anml.farmerId, village: village });
            else
                farmerUser = await farmer.findOne({ mobileNo: anml.farmerId });

            if (!anml || !farmerUser) {
                continue
            }

            if (details[i].freshReports === "fresh")
                aiFreshCounts.push(details[i])
            else if (details[i].freshReports === "repeat-r1")
                aiR1Counts.push(details[i])
            else if (details[i].freshReports === "repeat-r2")
                aiR2Counts.push(details[i])

        }

        success = true;
        return res.send(JSON.stringify({ freshCounts: aiFreshCounts.length, r1Counts: aiR1Counts.length, r2Counts: aiR2Counts.length, success }))

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
        let pdPregnantCount = [], pdNonPregnantCount = [];
        let details;
        if (village)
            details = await pdDetails.find({ technicianId: technicianId, villageName: village });
        else
            details = await pdDetails.find({ technicianId: technicianId });
        for (let i = 0; i < details.length; i++) {

            if (periodFrom && periodTo) {
                periodFrom = new Date(req.query.periodfrom);
                periodTo = new Date(req.query.periodto);
                if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                    continue
            }

            if (details[i].pdResult === "pregnant") {
                pdPregnantCount.push(details[i]);
            }
            else if (details[i].pdResult === "non-pregnant") {
                pdNonPregnantCount.push(details[i])
            }
        }

        success = true;
        return res.send(JSON.stringify({ pregnantCounts: pdPregnantCount.length, nonPregnantCounts: pdNonPregnantCount.length, success }))

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
        let calfBornMaleCount = [], calfBornFeMaleCount = [];
        let details;
        if (village)
            details = await calfBornDetail.find({ technicianId: technicianId, village: village })
        else
            details = await calfBornDetail.find({ technicianId: technicianId })

        for (let i = 0; i < details.length; i++) {

            if (periodFrom && periodTo) {
                periodFrom = new Date(req.query.periodfrom);
                periodTo = new Date(req.query.periodto);
                if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                    continue
            }

            if (details[i].sex === "male") {
                calfBornMaleCount.push(details[i]);
            }
            else if (details[i].sex === "female") {
                calfBornFeMaleCount.push(details[i])
            }
        }

        success = true;
        return res.send(JSON.stringify({ maleCounts: calfBornMaleCount.length, femaleCounts: calfBornFeMaleCount.length, success }))

    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})


module.exports = router;