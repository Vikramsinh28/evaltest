const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ Error: "Please authenticate using a valid token" });
    }
    try {
        const userData = jwt.verify(token, process.env.SECRET_KEY);
        if(userData){
            req.id = userData.id;
        }
        else{
            res.status(401).json({ Error: "Login with valid token" });
        }
        next();
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = validateToken;






