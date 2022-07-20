const user = require('../_models/user.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const formidable = require('formidable');
const cloudinary = require('../_helpers/cloudinary.helper');
const ObjectID = require('mongodb').ObjectId;

exports.userSignUp = (req, res) => {
    user.findOne({ email: req.body.email }).then(userFound => {
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
                let token = jsonwebtoken.sign({ _id: found._id, name: found.name, email: found.email }, 'privateKey');
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
exports.update = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        user.findOne({ _id: ObjectID(req.params.userId) }).then((found) => {
            if (found == null) {
                res.status(500).json({ err: true, msg: "Admin is not found." });
            } else {
                const body = {
                    name: fields.name,
                    phone: fields.phone,
                    address: fields.address,
                    state: fields.state,
                    country: fields.country,
                    profileImage: '',
                }
                if (files.profileImage === undefined) {
                    delete body.profilePhoto;
                    user.updateOne({ _id: ObjectID(req.params.userId) }, { $set: body }).then((updateUser) => {
                        if (updateUser.modifiedCount == 0) {
                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                        } else {
                            user.findOne({ _id: ObjectID(req.params.userId) }).then((found) => {
                                if (found == null) {
                                    res.status(500).json({ err: true, msg: "User is not found." });
                                } else {
                                    res.status(200).json({ err: false, msg: "User is updated successfully.", user: found });
                                }
                            }).catch((err) => {
                                res.status(500).json({ err: true, msg: err });
                            });
                        }
                    }).catch((err) => {
                        res.status(500).json({ err: true, msg: err });
                    })
                } else {
                    cloudinary.upload(files).then((uploaded) => {
                        const body = {
                            name: fields.name,
                            phone: fields.phone,
                            address: fields.address,
                            state: fields.state,
                            country: fields.country,
                            profileImage: uploaded,
                        }
                        user.updateOne({ _id: ObjectID(req.params.userId) }, { $set: body }).then((updateUser) => {
                            if (updateUser.modifiedCount == 0) {
                                res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                            } else {
                                user.findOne({ _id: ObjectID(req.params.userId) }).then((found) => {
                                    if (found == null) {
                                        res.status(500).json({ err: true, msg: "User is not found." });
                                    } else {
                                        res.status(200).json({ err: false, msg: "User is updated successfully.", user: found });
                                    }
                                }).catch((err) => {
                                    res.status(500).json({ err: true, msg: err });
                                });
                            }
                        }).catch((err) => {
                            res.status(500).json({ err: true, msg: err });
                        });
                    }).catch((err) => {
                        res.status(500).json({ err: true, msg: err });
                    });
                }
            }
        }).catch((err) => {
            res.status(500).json({ err: true, msg: err });
        });
    });
}