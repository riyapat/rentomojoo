const jwt = require('jsonwebtoken');
const Users = require('../models/userSchema');

const authenticate = async (req, res, next) => {
    try {
        const { authorization = '' } = req.headers;
        const [ bearer, token ] = authorization?.split(' ')

        if(!authorization || !token) {
            res.status(401).send('Invalid Token')
        }

        const verifyToken = jwt.verify(token, 'THIS_IS_THE_SECRET_KEY_OF_JWT');
        const user = await Users.findOne({ _id: verifyToken.id, token })

        if(!user){
            res.status(401).send('User not Found')
        }
        req.user = user;
        next()
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = authenticate;