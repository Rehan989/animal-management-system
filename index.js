const express = require('express')
const app = express()
const port = 5000
const connectMongodb = require('./db')
var cors = require('cors')
var cookieParser = require('cookie-parser')

connectMongodb()
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/userAuth'))
app.use('/api/doctor', require('./routes/doctorDetails'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})