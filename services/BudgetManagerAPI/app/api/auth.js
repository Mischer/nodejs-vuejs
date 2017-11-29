const mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('@config');

const api = {};

api.login = (User) => (req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if (err) throw err;

        if (!user) res.status(401).send({success: false, message: 'Authentication failed. User not found.'});

        user.comparePassword(req.body.password, (compareErr, matches) => {
            if (compareErr || !matches) {
                res.status(401).send({success: false, message: 'Authentication failed. Wrong password.'});
            }
            const token = jwt.sign({user}, config.secret);
            res.json({success: true, message: 'Token granted', token});
        });
    });
}

api.verify = (headers) => {
    if (!headers || !headers.authorization) return null;

    const split = headers.authorization.split(' ');
    if (split.length !== 2) {
        return null
    } else {
        return split[1];
    }
}

module.exports = api;