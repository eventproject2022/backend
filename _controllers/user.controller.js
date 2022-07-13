const user = require('../_models/user.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

exports.userSignUp = (req, res) => {
    user.findOne({ email: req.body.email }).then(userFound => {
        if (userFound == null) {
            user.findOne({ phone: req.body.phone }).then(userFound => {
                if (userFound == null) {
                    bcryptjs.hash(req.body.password, 10).then((hashed) => {
                        let ins = new user({
                            name: req.body.name,
                            email: req.body.email,
                            password: hashed,
                            phone: req.body.phone,
                            address: req.body.address,
                            state: req.body.state,
                            country: req.body.country,
                        });
                        ins.save().then((created) => {
                            if (created) {
                                res.status(200).json({ err: false, msg: "User Signup successfully." })
                            } else {
                                res.status(500).json({ err: true, msg: err })
                            }
                        })
                    }).catch((err) => {
                        res.status(500).json({ err: true, msg: err })
                    })
                } else {
                    res.status(500).json({ err: true, msg: "Phone number is already exists." });
                }
            }).catch(err => {
                res.status(500).json({ err: true, msg: err })
            });
        } else {
            res.status(500).json({ err: true, msg: "email is already exists." });
        }
    }).catch(err => {
        res.status(500).json({ err: true, msg: err })
    });
}
exports.userLogin = (req, res) => {
    user.findOne({ email: req.body.email }).then((found) => {
        bcryptjs.compare(req.body.password, found.password).then((compared) => {
            if (compared == true) {
                let token = jsonwebtoken.sign({ _id: found._id }, 'privateKey');
                res.status(200).json({ err: false, msg: "User Login successfully.", token: token });
            } else {
                res.status(500).json({ err: true, msg: "Password is incorrect." });
            }
        }).catch((err) => {
            res.status(500).json({ err: true, msg: err });
        });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err });
    });
}
exports.getAllUsers = (req, res) => {
    user.find({}).then((users) => {
        res.status(200).json({ err: false, msg: "User retrieve  successfully.", users: users });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err });
    })
}