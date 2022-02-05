const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const env = dotenv.config()
const JWT_SECRET = `${env.parsed['JWT_SECRET']}`;

let success = false

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        success = false
        return res.status(401).send({ error: "Invalid token!", success })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        success = false
        res.status(401).send({ error: "Invalid token!", success })
    }

}


module.exports = fetchuser;