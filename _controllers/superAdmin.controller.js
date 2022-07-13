const superAdmin = require('../_models/superAdmin.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

exports.superAdminSignUp = (req, res) => {
    bcryptjs.hash(req.body.password, 10).then((hashed) => {
        let ins = new superAdmin({
            email: req.body.email,
            password: hashed
        });
        ins.save().then((created) => {
            if (created) {
                res.status(200).json({ err: false, msg: "SuperAdmin Signup successfully." })
            } else {
                res.status(500).json({ err: true, msg: err })
            }
        })
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    })
}
exports.superAdminLogin = (req, res) => {
    superAdmin.findOne({ email: req.body.email }).then((found) => {
        bcryptjs.compare(req.body.password, found.password).then((compared) => {
            if (compared == true) {
                let token = jsonwebtoken.sign({ _id: found._id }, 'privateKey');
                res.status(200).json({ err: false, msg: "Admin Login successfully.", token: token });
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