const jwt = require('jsonwebtoken');
const User = require('../models/user')


// this is an auth middleware, this method runs to validate and allow only authenticated users to perform an action
const auth = async (req, res, next) => {
    try {
        // Get the token from the request
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify the token if it matches that of a loggin user
        const decoded = jwt.verify(token, 'hello');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send({error: 'please authenticate'})
    }
}

module.exports = auth;