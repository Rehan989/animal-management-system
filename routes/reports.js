const express = require('express')
const router = express.Router();
const fs = require("fs");
const fetchUser = require('../middleware/fetchUser')
const aiDetails = require('../models/aiDetails');
const pregnancyDetails = require('../models/pregnancyDetails');
const calfBornDetails = require('../models/calfBornDetails');
const technicianUser = require('../models/technicianUser');
const doctorUser = require('../models/doctorUser');
const animalAccount = require('../models/animal');
const bullSemenAccount = require('../models/bullSemen');
const farmerUser = require('../models/farmer');
const bullSemen = require('../models/bullSemen');
let success = false;

// Route 1: Getting reports for technician at 'api/report/technician/'
router.post('/technician/:reportType', fetchUser, async (req, res) => {
    try {
        let technicianId = req.user.id;
        let techUser = await technicianUser.findById(technicianId);
        if (!techUser) {
            success = false;
            return res.status(400).json({ error: "Invalid credentials!", success });
        }

        let docUser = await doctorUser.findOne({ email: techUser.doctor });

        let reportType = req.params.reportType;

        let details = [];
        let report = [];

        if (reportType === "ai") {
            let ait_user_id = [], vd_user_id = [], name_of_the_village = [],
                tag_no = [], ai_date = [], fresh_repeat = [], farmer_name = [];
            details = await aiDetails.find({ technicianId: technicianId });

            for (let i = 0; i < details.length; i++) {
                let bull = await bullSemenAccount.findOne({ bullId: details[i].bullId });
                let animal = await animalAccount.findOne({ tagNo: bull.animalTagNo })
                let farmer = await farmerUser.findOne({
                    mobileNo: animal.farmerId
                })

                ait_user_id.push(techUser.name);
                vd_user_id.push(docUser.name);
                name_of_the_village.push(farmer.village);
                tag_no.push(animal.tagNo);
                ai_date.push(details[i].date);
                fresh_repeat.push(details[i].freshReports);
                farmer_name.push(farmer.name);
            }
            report = {
                ait_user_id,
                vd_user_id,
                name_of_the_village,
                tag_no,
                ai_date,
                fresh_repeat,
                farmer_name
            }
            success = true;
            return res.send(JSON.stringify({ report, success }))
        }

        else if (reportType === "pd") {
            details = await pregnancyDetails.find({ technicianId: technicianId });
            console.log(details);
            let ait_user_id = [], vd_user_id = [], name_of_the_villages = [], farmer_name = [], tag_no = [], ai_date = [], date_of_pd = [], pd_result = [];
            details.map(detail => {
                console.log(techUser.name)
                ait_user_id.push(techUser.name);
                vd_user_id.push(docUser.name);
                name_of_the_villages.push(detail.villageName);
                farmer_name.push(detail.ownerName);
                tag_no.push(detail.animalTagNo);
                ai_date.push(detail.aiDate);
                date_of_pd.push(detail.pdDate);
                pd_result.push(detail.pdResult)
            })
            report = {
                ait_user_id,
                vd_user_id,
                name_of_the_villages,
                farmer_name,
                tag_no,
                ai_date,
                date_of_pd,
                pd_result
            }
            success = true;
            return res.send(JSON.stringify({ report, success }))
        }
        else if (reportType === "calf-born") {
            console.log(technicianId)
            let aidetails = await calfBornDetails.find({ technicianId: technicianId });
            let ait_user_id = [], vd_user_id = [], name_of_the_villages = [], farmer_name = [], tag_no = [], ai_date = [], date_of_pd = [], date_of_calf_born = [], calf_sex = [], ease_of_calvings = [], calf_tag_no = [];
            for (let i = 0; i < aidetails.length; i++) {
                let bull = await bullSemen.findOne({
                    bullId: aidetails[i].bullId
                })

                ait_user_id.push(techUser.name);
                vd_user_id.push(docUser.name);
                name_of_the_villages.push(aidetails[i].village);
                farmer_name.push(aidetails[i].owner);
                tag_no.push(bull.animalTagNo);
                ai_date.push(aidetails[i].aiDate);
                date_of_pd.push(aidetails[i].pdDate);
                date_of_calf_born.push(aidetails[i].date);
                calf_sex.push(aidetails[i].sex);
                ease_of_calvings.push(aidetails[i].easeOfCalvings);
                calf_tag_no.push(aidetails[i].tagNo);
            }
            report = {
                ait_user_id,
                vd_user_id,
                name_of_the_villages,
                farmer_name,
                tag_no,
                ai_date,
                date_of_pd,
                date_of_calf_born,
                calf_sex,
                ease_of_calvings,
                calf_tag_no
            }
            success = true;
            return res.send(JSON.stringify({ report, success }))
        }
        else {
            success = false;
            return res.send(JSON.stringify({ error: "Invalid report type!", success }))
        }
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 2: Getting reports for doctor at 'api/report/doctor/'
router.post('/doctor/:reportType', fetchUser, async (req, res) => {
    try {
        let doctorId = req.user.id;
        let docUser = await doctorUser.findById(doctorId);
        if (!docUser) {
            success = false;
            return res.status(400).json({ error: "Invalid credentials!", success });
        }
        for (let i = 0; i < docUser.technicians.length; i++) {
            let technician = await technicianUser.findById(docUser.technicians[i]);
            docUser.technicians[i] = technician;
        }

        let reportType = req.params.reportType;

        let details = [];
        let report = [];

        if (reportType === "ai") {
            let ait_user_id = [], vd_user_id = [], name_of_the_village = [],
                tag_no = [], ai_date = [], fresh_repeat = [], farmer_name = [];

            for (let k = 0; k < docUser.technicians.length; k++) {

                details = await aiDetails.find({ technicianId: docUser.technicians[k]._id });

                for (let i = 0; i < details.length; i++) {
                    let bull = await bullSemenAccount.findOne({ bullId: details[i].bullId });
                    let animal = await animalAccount.findOne({ tagNo: bull.animalTagNo })
                    let farmer = await farmerUser.findOne({
                        mobileNo: animal.farmerId
                    })

                    ait_user_id.push(docUser.technicians[k].name);
                    vd_user_id.push(docUser.name);
                    name_of_the_village.push(farmer.village);
                    tag_no.push(animal.tagNo);
                    ai_date.push(details[i].date);
                    fresh_repeat.push(details[i].freshReports);
                    farmer_name.push(farmer.name);
                }

            }
            report = {
                ait_user_id,
                vd_user_id,
                name_of_the_village,
                tag_no,
                ai_date,
                fresh_repeat,
                farmer_name
            }
            success = true;
            return res.send(JSON.stringify({ report, success }))
        }
        else if (reportType === "pd") {
            let ait_user_id = [], vd_user_id = [], name_of_the_villages = [], farmer_name = [], tag_no = [], ai_date = [], date_of_pd = [], pd_result = [];
            for (let k = 0; k < docUser.technicians.length; k++) {

                details = await pregnancyDetails.find({ technicianId: docUser.technicians[k]._id });

                details.map(detail => {
                    ait_user_id.push(docUser.technicians[k].name);
                    vd_user_id.push(docUser.name);
                    name_of_the_villages.push(detail.villageName);
                    farmer_name.push(detail.ownerName);
                    tag_no.push(detail.animalTagNo);
                    ai_date.push(detail.aiDate);
                    date_of_pd.push(detail.pdDate);
                    pd_result.push(detail.pdResult)
                })

            }

            report = {
                ait_user_id,
                vd_user_id,
                name_of_the_villages,
                farmer_name,
                tag_no,
                ai_date,
                date_of_pd,
                pd_result
            }
            success = true;
            return res.send(JSON.stringify({ report, success }))
        }
        else if (reportType === "calf-born") {
            let ait_user_id = [], vd_user_id = [], name_of_the_villages = [], farmer_name = [], tag_no = [], ai_date = [], date_of_pd = [], date_of_calf_born = [], calf_sex = [], ease_of_calvings = [], calf_tag_no = [];

            for (let k = 0; k < docUser.technicians.length; k++) {
                let aidetails = await calfBornDetails.find({ technicianId: docUser.technicians[k]._id });
                for (let i = 0; i < aidetails.length; i++) {
                    let bull = await bullSemen.findOne({
                        bullId: aidetails[i].bullId
                    })

                    ait_user_id.push(docUser.technicians[k].name);
                    vd_user_id.push(docUser.name);
                    name_of_the_villages.push(aidetails[i].village);
                    farmer_name.push(aidetails[i].owner);
                    tag_no.push(bull.animalTagNo);
                    ai_date.push(aidetails[i].aiDate);
                    date_of_pd.push(aidetails[i].pdDate);
                    date_of_calf_born.push(aidetails[i].date);
                    calf_sex.push(aidetails[i].sex);
                    ease_of_calvings.push(aidetails[i].easeOfCalvings);
                    calf_tag_no.push(aidetails[i].tagNo);
                }
            }

            report = {
                ait_user_id,
                vd_user_id,
                name_of_the_villages,
                farmer_name,
                tag_no,
                ai_date,
                date_of_pd,
                date_of_calf_born,
                calf_sex,
                ease_of_calvings,
                calf_tag_no
            }
            success = true;
            return res.send(JSON.stringify({ report, success }))
        }
        else {
            success = false;
            return res.send(JSON.stringify({ error: "Invalid report type!", success }))
        }
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

module.exports = router;