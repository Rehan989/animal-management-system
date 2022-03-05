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
const farmerUser = require('../models/farmer');
const createCsvWriter = require('csv-writer').createArrayCsvStringifier;

let success = false;

async function convert_dict_to_csv(headers, obj) {
    let values = []
    let records = []
    for (const [key, value] of Object.entries(obj)) {
        values.push(value)
    }

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

        let { village,
            periodFrom,
            periodTo } = req.body;

        periodFrom = new Date(periodFrom);
        periodTo = new Date(periodTo);

        if (reportType === "ai") {
            details = await aiDetails.find({ technicianId: technicianId });

            for (let i = 0; i < details.length; i++) {
                if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                    continue
                // let bull = await bullSemenAccount.findOne({ bullId: details[i].bullId });
                let animal = await animalAccount.findOne({ tagNo: details[i].animalTagNo })
                let farmer = await farmerUser.findOne({
                    mobileNo: animal.farmerId
                })

                if (farmer.village !== village) {
                    continue
                }
                let data = [techUser.name, docUser.name, farmer.village, animal.tagNo, details[i].date.toISOString().replaceAll('-', '/').substring(0, 10), details[i].freshReports, farmer.name]
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
            details = await pregnancyDetails.find({ technicianId: technicianId, villageName: village });
            for (let i = 0; i < details.length; i++) {
                if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                    continue

                let data = [techUser.name, docUser.name, details[i].villageName, details[i].ownerName, details[i].animalTagNo, details[i].aiDate.replaceAll('-', '/').substring(0, 10), details[i].pdDate.replaceAll('-', '/').substring(0, 10), details[i].pdResult]
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
                "pd_result"
            ]

            let report_csv = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ report_csv, success }))
        }
        else if (reportType === "calf-born") {
            let details = await calfBornDetails.find({ technicianId: technicianId, village: village });
            for (let i = 0; i < details.length; i++) {
                if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                    continue

                let data = [techUser.name, docUser.name, details[i].village, details[i].owner, details[i].animalTagNo, details[i].aiDate.replaceAll('-', '/').substring(0, 10), details[i].date.toISOString().replaceAll('-', '/').substring(0, 10), details[i].sex, details[i].easeOfCalvings, details[i].tagNo]
                report.push(data)
            }
            let headers = [
                "ait_user_id",
                "vd_user_id",
                "name_of_the_villages",
                "farmer_name",
                "tag_no",
                "ai_date",
                "date_of_calf_born",
                "calf_sex",
                "ease_of_calvings",
                "calf_tag_no"
            ]

            let report_csv = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ report_csv, success }))
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

        let { village,
            periodFrom,
            periodTo } = req.body;

        periodFrom = new Date(periodFrom);
        periodTo = new Date(periodTo);

        if (reportType === "ai") {

            for (let k = 0; k < docUser.technicians.length; k++) {

                details = await aiDetails.find({ technicianId: docUser.technicians[k]._id });

                for (let i = 0; i < details.length; i++) {
                    // let bull = await bullSemenAccount.findOne({ bullId: details[i].bullId });
                    let animal = await animalAccount.findOne({ tagNo: details[i].animalTagNo })
                    let farmer = await farmerUser.findOne({
                        mobileNo: animal.farmerId
                    })

                    if (farmer.village !== village) {
                        continue
                    }

                    if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                        continue

                    let data = [docUser.technicians[k].name, docUser.name, farmer.village, animal.tagNo, details[i].date.toISOString().replaceAll('-', '/').substring(0, 10), details[i].freshReports, farmer.name]

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
            let report_csv = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ report_csv, success }))
        }
        else if (reportType === "pd") {
            for (let k = 0; k < docUser.technicians.length; k++) {

                details = await pregnancyDetails.find({ technicianId: docUser.technicians[k]._id, villageName: village });

                details.map(detail => {

                    if (!((periodFrom.getTime() < detail.date.getTime()) && (detail.date.getTime() < periodTo.getTime())))
                        return

                    let data = [docUser.technicians[k].name, docUser.name, detail.villageName, detail.ownerName, detail.animalTagNo, detail.aiDate.replaceAll('-', '/').substring(0, 10), detail.pdDate.replaceAll('-', '/').substring(0, 10), detail.pdResult]

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
            let report_csv = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ report_csv, success }))
        }
        else if (reportType === "calf-born") {

            for (let k = 0; k < docUser.technicians.length; k++) {
                let details = await calfBornDetails.find({ technicianId: docUser.technicians[k]._id, village: village });
                for (let i = 0; i < details.length; i++) {

                    if (!((periodFrom.getTime() < details[i].date.getTime()) && (details[i].date.getTime() < periodTo.getTime())))
                        continue

                    let data = [docUser.technicians[k].name, docUser.name, details[i].village, details[i].owner, details[i].animalTagNo, details[i].aiDate.substring(0, 10).replaceAll('-', '/'), details[i].date.toISOString().substring(0, 10).replaceAll('-', '/'), details[i].sex, details[i].easeOfCalvings, details[i].tagNo];

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
                "date_of_calf_born",
                "calf_sex",
                "ease_of_calvings",
                "calf_tag_no"
            ]
            let report_csv = await convert_dict_to_csv(headers, report)
            success = true;
            return res.send(JSON.stringify({ report_csv, success }))
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