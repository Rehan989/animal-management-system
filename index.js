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
app.use('/api/get/', require('./routes/data'))
app.use('/api/details', require('./routes/details'))
app.use('/api/register', require('./routes/registrations'))
app.use('/api/search', require('./routes/search'))
app.use('/api/report', require('./routes/reports'))
app.use('/api/summary', require('./routes/summary'))

app.listen(port, () => {
    console.log(`Backend app running at http://localhost:${port}`)
})