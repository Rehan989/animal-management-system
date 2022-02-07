var express = require('express')
var router = express.Router();
const fs = require("fs");
let success = false;

// Route 1: Getting all the villages list at '/api/get/villages/
router.get('/villages/', async (req, res) => {
    try {
        let data = fs.readFileSync("data/villages.json", "UTF-8");
        data = JSON.parse(data)
        success = true;
        return res.send(JSON.stringify({ villages: data, success }))
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

// Route 2: Getting all the villages list at '/api/get/species/
router.get('/species/', async (req, res) => {
    try {
        let data = fs.readFileSync("data/species.json", "UTF-8");
        data = JSON.parse(data)
        success = true;
        return res.send(JSON.stringify({ species: data, success }))
    } catch (error) {
        console.error(error.message);
        success = false
        return res.status(500).json({ error: "Internal Server Error", success });
    }
})

module.exports = router;