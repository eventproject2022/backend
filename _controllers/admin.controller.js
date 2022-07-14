const admin = require('../_models/admin.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectId;
const formidable = require('formidable');
const generatePassword = require('generate-password');
const cloudinary = require('../_helpers/cloudinary.helper');
const nodemailer = require('../_helpers/mailer.helper');
exports.createAdmin = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        admin.findOne({ email: fields.email }).then((found) => {
            if (found == null) {
                admin.findOne({ phone: fields.phone }).then((found) => {
                    if (found == null) {
                        let password = generatePassword.generate({ length: 8, number: true, uppercase: true });
                        bcryptjs.hash(password, 10).then((hashed) => {
                            if (files.profileImage == undefined) {
                                let ins = new admin({
                                    firstName: fields.firstName,
                                    lastName: fields.lastName,
                                    email: fields.email,
                                    alternativeEmail: fields.alternativeEmail,
                                    phone: fields.phone,
                                    password: hashed,
                                    address: fields.address,
                                    city: fields.city,
                                    state: fields.state,
                                    country: fields.country,
                                })
                                ins.save().then((created) => {
                                    if (created == null) {
                                        res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                                    } else {
                                        nodemailer.sendMail(fields.email, 'create_admin', password, created.email).then((ed) => {
                                            res.status(200).json({ err: false, msg: "Admin is created successfully." });
                                        }).catch((err) => {
                                            res.status(500).json({ err: true, msg: err });
                                        });
                                    }
                                }).catch((err) => {
                                    res.status(500).json({ err: true, msg: err });
                                });
                            } else {
                                cloudinary.upload(files).then((uploaded) => {
                                    let ins = new admin({
                                        firstName: fields.firstName,
                                        lastName: fields.lastName,
                                        email: fields.email,
                                        alternativeEmail: fields.alternativeEmail,
                                        phone: fields.phone,
                                        password: hashed,
                                        address: fields.address,
                                        city: fields.city,
                                        state: fields.state,
                                        country: fields.country,
                                        profileImage: uploaded,
                                    })
                                    ins.save().then((created) => {
                                        if (created == null) {
                                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                                        } else {
                                            nodemailer.sendMail(fields.email, 'create_admin', password, created.email).then((sended) => {
                                                res.status(200).json({ err: false, msg: "Admin is created successfully." });
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
                        }).catch((err) => {
                            res.status(500).json({ err: true, msg: err });
                        });
                    } else {
                        res.status(500).json({ err: true, msg: "Phone number is already exists." });
                    }
                }).catch((err) => {
                    res.status(500).json({ err: true, msg: "Phone number is already exists." });
                });
            } else {
                res.status(500).json({ err: true, msg: "email is already exists." });
            }
        }).catch((err) => {
            res.status(500).json({ err: true, msg: err });
        });
    })
}
exports.adminLogin = (req, res) => {
    admin.findOne({ email: req.body.email }).then((found) => {
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
exports.updateAdmin = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        admin.findOne({ _id: ObjectID(req.params.adminId) }).then((found) => {
            if (found == null) {
                res.status(500).json({ err: true, msg: "Admin is not found." });
            } else {
                const body = {
                    firstName: fields.firstName,
                    lastName: fields.lastName,
                    alternativeEmail: fields.alternativeEmail,
                    phone: fields.phone,
                    address: fields.address,
                    city: fields.city,
                    state: fields.state,
                    country: fields.country,
                    profilePhoto: '',
                }
                if (files.profilePhoto === undefined) {
                    delete body.profilePhoto;
                    admin.updateOne({ _id: ObjectID(req.params.adminId) }, { $set: body }).then((updateAdmin) => {
                        if (updateAdmin.modifiedCount == 0) {
                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                        } else {
                            admin.findOne({ _id: ObjectID(req.params.adminId) }).then((found) => {
                                if (found == null) {
                                    res.status(500).json({ err: true, msg: "Admin is not found." });
                                } else {
                                    res.status(200).json({ err: false, msg: "Admin is updated successfully.", admin: found });
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
                            firstName: fields.firstName,
                            lastName: fields.lastName,
                            alternativeEmail: fields.alternativeEmail,
                            phone: fields.phone,
                            address: fields.address,
                            city: fields.city,
                            state: fields.state,
                            country: fields.country,
                            profilePhoto: uploaded,
                        }
                        admin.updateOne({ _id: ObjectID(req.params.adminId) }, { $set: body }).then((updateAdmin) => {
                            if (updateAdmin.modifiedCount == 0) {
                                res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                            } else {
                                admin.findOne({ _id: ObjectID(req.params.adminId) }).then((found) => {
                                    if (found == null) {
                                        res.status(500).json({ err: true, msg: "Admin is not found." });
                                    } else {
                                        res.status(200).json({ err: false, msg: "Admin is updated successfully.", admin: found });
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
exports.searchAdmin = (req, res) => {
    admin.find({ firstName: { $regex: req.query.query, $options: 'i' } }).then((results) => {
        res.status(200).json({ err: false, msg: "Admin found successfully.", data: results });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    })
}
exports.getAllAdmins = (req, res) => {
    admin.find({}).then((results) => {
        res.status(200).json({ err: false, msg: "Admin found successfully.", data: results });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    });
}
exports.getAdminById = (req, res) => {
    admin.findOne({ _id: ObjectID(req.params._id) }).then((adminFound) => {
        if (adminFound == null) {
            res.status(500).json({ err: true, msg: "Admin Not found." });
        } else {
            res.status(200).json({ err: false, msg: "Admin found successfully.", Admin: adminFound });
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    })
}
exports.deleteAdminById = (req, res) => {
    admin.deleteOne({ _id: ObjectID(req.params.adminId) }).then((deleteAdmin) => {
        if (deleteAdmin.deletedCount == 1) {
            res.status(200).json({ err: false, msg: "Admin Delete Successfully." });
        } else {
            res.status(500).json({ err: false, msg: "Admin Not Deleted" });
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    });
}
