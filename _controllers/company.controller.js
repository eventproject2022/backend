const company = require('../_models/company.model');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectId;
const formidable = require('formidable');
const generatePassword = require('generate-password');
const cloudinary = require('../_helpers/cloudinary.helper');
const nodemailer = require('../_helpers/mailer.helper');
const uniqueId = require('../_helpers/uniqueId.helper');
exports.createCompany = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        company.findOne({ email: fields.email }).then((found) => {
            if (found == null) {
                company.findOne({ phone: fields.phone }).then((found) => {
                    if (found == null) {
                        company.findOne({ companyRgNo: fields.companyRgNo }).then((found) => {
                            if (found == null) {
                                uniqueId.genrate("company").then((uniqueId) => {
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
                                                uniqueId: uniqueId,
                                                about: fields.about,
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
                                                    uniqueId: uniqueId,
                                                    about: fields.about,
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
                                                console.error(err)
                                                res.status(500).json({ err: true, msg: err });
                                            });
                                        }
                                    }).catch((err) => {
                                        res.status(500).json({ err: true, msg: err });
                                    });
                                }).catch((err) => {
                                    res.status(500).json({ err: true, msg: err });
                                });
                            } else {
                                res.status(500).json({ err: true, msg: 'Registration Number already Exist.' })
                            }
                        }).catch((err) => {
                            console.error(err)
                            res.status(500).json({ err: true, msg: err });
                        });
                    } else {
                        res.status(500).json({ err: true, msg: "Phone number is already exists." });
                    }
                }).catch((err) => {
                    console.error(err)
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
        if (found == null) {
            res.status(500).json({ err: true, msg: "Account does not exist" });
        } else {
            bcryptjs.compare(req.body.password, found.password).then((compared) => {
                if (compared == true) {
                    let token = jsonwebtoken.sign({ _id: found._id, companyName: found.companyName, companyType: found.companyType, companyRgNo: found.companyRgNo, companyImage: found.companyImage, uniqueId: found.uniqueId }, 'privateKey');
                    res.status(200).json({ err: false, msg: "Company Login successfully.", token: token });
                } else {
                    res.status(500).json({ err: true, msg: "Password is incorrect." });
                }
            }).catch((err) => {
                res.status(500).json({ err: true, msg: err });
            });
        }
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
                    isActive: fields.isActive,
                }
                if (files.companyImage === undefined) {
                    delete body.companyImage;
                    company.updateOne({ _id: ObjectID(req.params.companyId) }, { $set: body }).then((updateAdmin) => {
                        console.log(updateAdmin)
                        if (updateAdmin.modifiedCount == 0) {
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
                            isActive: fields.isActive,
                        }
                        company.updateOne({ _id: ObjectID(req.params.companyId) }, { $set: body }).then((updateCompany) => {
                            console.log(updateCompany)
                            if (updateCompany.modifiedCount == 0) {
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
exports.getCompanyAdminId = (req, res) => {
    company.find({ adminId: ObjectID(req.params.adminId) }).then((companyFound) => {
        res.status(200).json({ err: false, msg: "Company found successfully.", company: companyFound });
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
exports.changePassword = (req, res) => {
    company.findOne({ _id: ObjectID(req.body.companyId) }).then((companyFound) => {
        if (companyFound == null) {
            res.status(500).json({ err: true, msg: "Company not found" });
        } else {
            bcryptjs.compare(req.body.oldPassword, companyFound.password).then((compared) => {
                if (compared == true) {
                    bcryptjs.hash(req.body.newPassword, 10).then((hashed) => {
                        company.updateOne({ _id: ObjectID(req.body.companyId) }, { $set: { password: hashed } }).then((updateCompany) => {
                            if (updateCompany.modifiedCount == 1) {
                                res.status(200).json({ err: false, msg: "Password changed successfully" })
                            } else {
                                res.status(500).json({ err: false, msg: "Password Not changed " })
                            }
                        }).catch((err) => {
                            console.log(err)
                            res.status(500).json({ err: true, msg: err })
                        });
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).json({ err: true, msg: err })
                    });
                } else {
                    res.status(500).json({ err: false, msg: "Old Password Not matched " })
                }
            }).catch((err) => {
                console.log(err)
                res.status(500).json({ err: true, msg: err })
            });
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).json({ err: true, msg: err })
    });
}
exports.getById = (req, res) => {
    company.findOne({ _id: ObjectID(req.params.companyId) }).then((companyFound) => {
        if (companyFound !== null) {
            res.status(200).json({ err: false, msg: " company found successfully", company: companyFound })
        } else {
            res.status(500).json({ err: false, msg: " company not found" })
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: err })
    })
}