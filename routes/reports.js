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
const createCsvWriter = require('csv-writer').createArrayCsvStringifier;

let success = false;

async function convert_dict_to_csv(headers, obj) {
    let values = []
    let records = []
    for (const [key, value] of Object.entries(obj)) {
        values.push(value)
    }

    // for (let i = 0; i < values.length; i++) {
    //     let record = []
    //     for (let k = 0; k < values[i].length; k++) {
    //         console.log(values[i][k])
    //         record.push(values[i][k])
    //     }
    //     console.log(record)
    //     records.push(record)
    // }

    // console.log(records)

    const csvWriter = createCsvWriter({
        header: headers
    });

    return { header: csvWriter.getHeaderString(), body: csvWriter.stringifyRecords(values) };
}

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
            details = await aiDetails.find({ technicianId: technicianId });

            for (let i = 0; i < details.length; i++) {
                let bull = await bullSemenAccount.findOne({ bullId: details[i].bullId });
                let animal = await animalAccount.findOne({ tagNo: bull.animalTagNo })
                let farmer = await farmerUser.findOne({
                    mobileNo: animal.farmerId
                })

                let data = [techUser.name, docUser.name, farmer.village, animal.tagNo, details[i].date, details[i].freshReports, farmer.name]
                report.push(data)
            }

            let report_csv = await convert_dict_to_csv(["ait_user_id",
                "vd_user_id",
                "name_of_the_village",
                "tag_no",
                "ai_date",
                "fresh_repeat",
                "farmer_name"], report);

            success = true;
            return res.send(JSON.stringify({ report_csv, success }))
        }

        else if (reportType === "pd") {
            details = await pregnancyDetails.find({ technicianId: technicianId });
            details.map(detail => {
                let data = [techUser.name, docUser.name, detail.villageName, detail.ownerName, detail.animalTagNo, detail.aiDate, detail.pdDate, detail.pdResult]
                report.push(data)
            })
            let headers = [
                "ait_user_id",
                "vd_user_id",
                "name_of_the_villages",
                "farmer_name",
                "tag_no",
                "ai_date",
                "date_of_pd",
                "pd_result"
            ]

            let csv_report = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ csv_report, success }))
        }
        else if (reportType === "calf-born") {
            let aidetails = await calfBornDetails.find({ technicianId: technicianId });
            for (let i = 0; i < aidetails.length; i++) {
                let bull = await bullSemen.findOne({
                    bullId: aidetails[i].bullId
                })

                let data = [techUser.name, docUser.name, aidetails[i].village, aidetails[i].owner, bull.animalTagNo, aidetails[i].aiDate, aidetails[i].pdDate, aidetails[i].date, aidetails[i].sex, aidetails[i].easeOfCalvings, aidetails[i].tagNo]
                report.push(data)
            }
            let headers = [
                "ait_user_id",
                "vd_user_id",
                "name_of_the_villages",
                "farmer_name",
                "tag_no",
                "ai_date",
                "date_of_pd",
                "date_of_calf_born",
                "calf_sex",
                "ease_of_calvings",
                "calf_tag_no"
            ]

            let csv_report = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ csv_report, success }))
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

            for (let k = 0; k < docUser.technicians.length; k++) {

                details = await aiDetails.find({ technicianId: docUser.technicians[k]._id });

                for (let i = 0; i < details.length; i++) {
                    let bull = await bullSemenAccount.findOne({ bullId: details[i].bullId });
                    let animal = await animalAccount.findOne({ tagNo: bull.animalTagNo })
                    let farmer = await farmerUser.findOne({
                        mobileNo: animal.farmerId
                    })

                    let data = [docUser.technicians[k].name, docUser.name, farmer.village, animal.tagNo, details[i].date, details[i].freshReports, farmer.name]

                    report.push(data)
                }

            }
            let headers = [
                "ait_user_id",
                "vd_user_id",
                "name_of_the_village",
                "tag_no",
                "ai_date",
                "fresh_repeat",
                "farmer_name"
            ]
            let csv_report = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ csv_report, success }))
        }
        else if (reportType === "pd") {
            for (let k = 0; k < docUser.technicians.length; k++) {

                details = await pregnancyDetails.find({ technicianId: docUser.technicians[k]._id });

                details.map(detail => {
                    let data = [docUser.technicians[k].name, docUser.name, detail.villageName, detail.ownerName, detail.animalTagNo, detail.aiDate, detail.pdDate, detail.pdResult]

                    report.push(data)
                })

            }

            let headers = [
                "ait_user_id",
                "vd_user_id",
                "name_of_the_villages",
                "farmer_name",
                "tag_no",
                "ai_date",
                "date_of_pd",
                "pd_result"
            ]
            let csv_report = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ csv_report, success }))
        }
        else if (reportType === "calf-born") {
            let ait_user_id = [], vd_user_id = [], name_of_the_villages = [], farmer_name = [], tag_no = [], ai_date = [], date_of_pd = [], date_of_calf_born = [], calf_sex = [], ease_of_calvings = [], calf_tag_no = [];

            for (let k = 0; k < docUser.technicians.length; k++) {
                let aidetails = await calfBornDetails.find({ technicianId: docUser.technicians[k]._id });
                for (let i = 0; i < aidetails.length; i++) {
                    let bull = await bullSemen.findOne({
                        bullId: aidetails[i].bullId
                    })

                    let data = [docUser.technicians[k].name, docUser.name, aidetails[i].village, aidetails[i].owner, bull.animalTagNo, aidetails[i].aiDate, aidetails[i].pdDate, aidetails[i].date, aidetails[i].sex, aidetails[i].easeOfCalvings, aidetails[i].tagNo];

                    report.push(data)
                }
            }

            let headers = [
                "ait_user_id",
                "vd_user_id",
                "name_of_the_villages",
                "farmer_name",
                "tag_no",
                "ai_date",
                "date_of_pd",
                "date_of_calf_born",
                "calf_sex",
                "ease_of_calvings",
                "calf_tag_no"
            ]
            let csv_report = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ csv_report, success }))
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