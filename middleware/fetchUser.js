const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const env = dotenv.config()
const JWT_SECRET = `${env.parsed['JWT_SECRET']}`;

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Invalid token!" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid token!" })
    }

}


module.exports = fetchuser;