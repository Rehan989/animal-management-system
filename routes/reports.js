const express = require('express')
const router = express.Router();
const fs = require("fs");
const fetchUser = require('../middleware/fetchUser')
const aiDetails = require('../models/aiDetails');
const pregnancyDetails = require('../models/pregnancyDetails');
const technicianUser = require('../models/technicianUser');
const doctorUser = require('../models/doctorUser');
const bullSemenAccount = require('../models/bullSemen');
const farmerUser = require('../models/farmer');
let success = false;

// Route 1: Getting reports for technician at 'api/report/technician/'
router.post('/technician/:reportType', fetchUser, async (req, res) => {
    try {
        let technicianId = req.user.id;
        let techUser = await technicianUser.findById(technicianId);
        if (!techUser) {
            success = false;
            return res.status(400).json({ error: "Invalid technician id!", success });
        }

        let docUser = await doctorUser.findOne({ email: techUser.doctor });

        let reportType = req.params.reportType;

        let details = [];
        let report = [];

        if (reportType === "ai") {
            details = await aiDetails.find({ technicianId: technicianId });
            console.log(details[0])
            let ait_user_id = [], vd_user_id = [], ai_date = [], fresh_repeat = [];
            details.map(detail => {
                ait_user_id.push(techUser.name);
                vd_user_id.push(docUser.name);
                ai_date.push(detail.date);
                fresh_repeat.push(detail.freshReports)

                // let bull = await bullSemenAccount.findOne({ bullId: detail.bullId });
                // let farmer = await farmerUser.findOne({

                // })
            })
            report = {
                ait_user_id,
                vd_user_id,
                ai_date,
                fresh_repeat
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
                // tag_no.push();
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