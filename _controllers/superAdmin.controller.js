const superAdmin = require('../_models/superAdmin.model');
const formidable = require('formidable');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const cloudinary = require('../_helpers/cloudinary.helper');

exports.superAdminSignUp = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        superAdmin.findOne({ email: fields.email }).then((superAdminFound) => {
            if (superAdminFound == null) {
                bcryptjs.hash(fields.password, 10).then((hashed) => {
                    if (files.profileImage == undefined) {
                        let ins = new superAdmin({
                            firstName: fields.firstName,
                            lastName: fields.lastName,
                            email: fields.email,
                            alternativeEmail: fields.alternativeEmail,
                            phone: fields.phone,
                            address: fields.address,
                            city: fields.city,
                            state: fields.state,
                            country: fields.country,
                            password: hashed
                        });
                        ins.save().then((created) => {
                            if (created) {
                                res.status(200).json({ err: false, msg: "SuperAdmin Signup successfully." })
                            } else {
                                res.status(500).json({ err: true, msg: err })
                            }
                        })
                    } else {
                        cloudinary.upload(files).then((upload) => {
                            let ins = new superAdmin({
                                firstName: fields.firstName,
                                lastName: fields.lastName,
                                email: fields.email,
                                alternativeEmail: fields.alternativeEmail,
                                phone: fields.phone,
                                address: fields.address,
                                city: fields.city,
                                state: fields.state,
                                country: fields.country,
                                password: hashed,
                                profileImage: upload,
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
                        });
                    }
                }).catch((err) => {
                    res.status(500).json({ err: true, msg: err })
                })
            } else {
                res.status(500).json({ err: true, msg: "Email already exists" })
            }
        })
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