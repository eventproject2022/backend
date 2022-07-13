const company = require('../_models/company.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectId;
const formidable = require('formidable');
const generatePassword = require('generate-password');
const cloudinary = require('../_helpers/cloudinary.helper');
const nodemailer = require('../_helpers/mailer.helper');


exports.createCompany = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        company.findOne({ email: fields.email }).then((found) => {
            if (found == null) {
                company.findOne({ contact: fields.contact }).then((found) => {
                    if (found == null) {
                        company.findOne({ companyRgNo: fields.companyRgNo }).then((found) => {
                            if (found == null) {
                                let password = generatePassword.generate({ length: 8, number: true, uppercase: true });
                                bcryptjs.hash(password, 10).then((hashed) => {
                                    if (files.companyImage == undefined) {
                                        let ins = new company({
                                            adminId: ObjectID(fields.adminId),
                                            companyName: fields.companyName,
                                            companyType: fields.companyType,
                                            companyRgNo: fields.companyRgNo,
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
                                                nodemailer.sendMail(fields.email, 'create_company', password, created.email).then((ed) => {
                                                    res.status(200).json({ err: false, msg: "Company is created successfully." });
                                                }).catch((err) => {
                                                    res.status(500).json({ err: true, msg: err });
                                                });
                                            }
                                        }).catch((err) => {
                                            res.status(500).json({ err: true, msg: err });
                                        });
                                    } else {
                                        cloudinary.upload(files).then((uploaded) => {
                                            let ins = new company({
                                                adminId: ObjectID(fields.adminId),
                                                companyName: fields.companyName,
                                                companyType: fields.companyType,
                                                companyRgNo: fields.companyRgNo,
                                                email: fields.email,
                                                alternativeEmail: fields.alternativeEmail,
                                                phone: fields.phone,
                                                password: hashed,
                                                address: fields.address,
                                                city: fields.city,
                                                state: fields.state,
                                                country: fields.country,
                                                companyImage: uploaded,
                                            })
                                            ins.save().then((created) => {
                                                if (created == null) {
                                                    res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                                                } else {
                                                    nodemailer.sendMail(fields.email, 'create_company', password, created.email).then((sended) => {
                                                        res.status(200).json({ err: false, msg: "Company is created successfully." });
                                                    }).catch((err) => {
                                                        res.status(500).json({ err: true, msg: err });
                                                    });
                                                }
                                            }).catch((err) => {
                                                console.log(err);
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
                                res.state(500).json({ err: true, msg: 'Registration Number already Exist.' })
                            }
                        }).catch((err) => {
                            res.status(500).json({ err: true, msg: err });
                        });
                    } else {
                        res.status(500).json({ err: true, msg: "Phone number is already exists." });
                    }
                }).catch((err) => {
                    res.status(500).json({ err: true, msg: err });
                });
            } else {
                res.status(500).json({ err: true, msg: "email is already exists." });
            }
        }).catch((err) => {
            res.status(500).json({ err: true, msg: err });
        });
    })
}
exports.companyLogin = (req, res) => {
    company.findOne({ email: req.body.email }).then((found) => {
        bcryptjs.compare(req.body.password, found.password).then((compared) => {
            if (compared == true) {
                let token = jsonwebtoken.sign({ _id: found._id }, 'privateKey');
                res.status(200).json({ err: false, msg: "Company Login successfully.", token: token });
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
exports.updateCompany = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        company.findOne({ _id: ObjectID(req.params.companyId) }).then((found) => {
            if (found == null) {
                res.status(500).json({ err: true, msg: "Company is not found." });
            } else {
                const body = {
                    companyName: fields.companyName,
                    companyType: fields.companyType,
                    alternativeEmail: fields.alternativeEmail,
                    phone: fields.phone,
                    address: fields.address,
                    city: fields.city,
                    state: fields.state,
                    country: fields.country,
                    companyImage: '',
                }
                if (files.companyImage === undefined) {
                    delete body.companyImage;
                    company.updateOne({ _id: ObjectID(req.params.companyId) }, { $set: body }).then((updateAdmin) => {
                        if (updateAdmin.nModified == 0) {
                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                        } else {
                            company.findOne({ _id: ObjectID(req.params.companyId) }).then((found) => {
                                if (found == null) {
                                    res.status(500).json({ err: true, msg: "Company is not found." });
                                } else {
                                    res.status(200).json({ err: false, msg: "Company is updated successfully.", company: found });
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
                            companyName: fields.companyName,
                            companyType: fields.companyType,
                            alternativeEmail: fields.alternativeEmail,
                            phone: fields.phone,
                            address: fields.address,
                            city: fields.city,
                            state: fields.state,
                            country: fields.country,
                            companyImage: uploaded,
                        }
                        company.updateOne({ _id: ObjectID(req.params.companyId) }, { $set: body }).then((updateCompany) => {
                            if (updateCompany.nModified == 0) {
                                res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                            } else {
                                company.findOne({ _id: ObjectID(req.params.companyId) }).then((found) => {
                                    if (found == null) {
                                        res.status(500).json({ err: true, msg: "Company is not found." });
                                    } else {
                                        res.status(200).json({ err: false, msg: "Company is updated successfully.", company: found });
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
exports.searchCompanies = (req, res) => {
    company.find({ companyName: { $regex: req.query.query, $options: 'i' } }).then((results) => {
        res.status(200).json({ err: false, msg: "Company found successfully.", data: results });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    })
}
exports.getAllCompanies = (req, res) => {
    company.find({}).then((results) => {
        res.status(200).json({ err: false, msg: "Company found successfully.", data: results });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    });
}
exports.getCompanyById = (req, res) => {
    company.findOne({ _id: ObjectID(req.params.companyId) }).then((companyFound) => {
        if (companyFound == null) {
            res.status(500).json({ err: true, msg: "Company Not found." });
        } else {
            res.status(200).json({ err: false, msg: "Company found successfully.", Admin: companyFound });
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    })
}
exports.deleteCompanyById = (req, res) => {
    company.deleteOne({ _id: ObjectID(req.params.companyId) }).then((deleteCompany) => {
        if (deleteCompany.deletedCount == 1) {
            res.status(200).json({ err: false, msg: "Company Delete Successfully." });
        } else {
            res.status(500).json({ err: false, msg: "Company Not Deleted" });
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    });
}