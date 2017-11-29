const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    clients: [{}]
});

Schema.pre('save', function (next) {
    if (!this.isModified('password') && !this.isNew) return next();

    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (bcryptErr, hash) => {
            if (bcryptErr) return next(bcryptErr);

            user.password = hash;
            next();
        });
    });
});

Schema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, matches) => {
        if (err) return callback(err);

        callback(null, matches);
    });
};

mongoose.model('User', Schema);