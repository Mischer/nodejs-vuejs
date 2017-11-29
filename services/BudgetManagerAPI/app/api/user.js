const mongoose = require('mongoose');
const api = {};
api.setup = (User) => (req, res) => {
    const admin = new User({
        username: 'admin',
        password: 'admin',
        clients: []
    });
    admin.save(err => {
        if (err) throw err;
        console.log('Admin account was succesfully set up');
        res.json({ success: true });
    })
}

api.index = (User, BudgetToken) => (req, res) => {
    const token = BudgetToken;
    if (!token) return res.status(403).send({ success: false, message: 'Unauthorized' });

    User.find({}, (err, users) => {
        if (err) throw err;
        res.status(200).json(users);
    });
}

api.signup = (User) => (req, res) => {
    if (!req.body.username || !req.body.password) res.json({ success: false, message: 'Please, pass a username and password.' });
    else {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            clients: []
        });
        newUser.save((error) => {
            if (error) return res.status(400).json({ success: false, message:  'Username already exists.' });
            res.json({ success: true, message: 'Account created successfully' });
        })
    }
}
module.exports = api;