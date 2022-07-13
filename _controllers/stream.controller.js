const stream = require('../_models/stream.model');
const admin = require('../_models/admin.model');
const ObjectID = require('mongodb').ObjectId;
const company = require('../_models/company.model');
exports.createStream = (req, res) => {
    stream.findOne({ companyId: ObjectID(req.body.companyId) }).then((streamFound) => {
        if (streamFound == null) {
            let ins = new stream(req.body);
            ins.save().then((created) => {
                if (created == null) {
                    res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                } else {
                    company.updateOne({ _id: ObjectID(req.body.companyId) }, { $set: { streamId: created._id } }).then((updated) => {
                        if (updated.modifiedCount === 1) {
                            res.status(200).json({ err: false, msg: "Successfully created.", streamId: created._id });
                        } else {
                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                        }
                    }).catch((err) => {
                        res.status(500).json({ err: true, msg: err });
                    });
                }
            }).catch((err) => {
                res.status(500).json({ err: true, msg: err });
            });
        } else {
            stream.deleteOne({ companyId: req.body.companyId }).then((streamDelete) => {
                if (streamDelete.deletedCount === 1) {
                    let ins = new stream({
                        companyId: req.body.companyId,
                        isActive: req.body.isActive,
                        streamType: req.body.streamType,
                    });
                    ins.save().then((created) => {
                        if (created == null) {
                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                        } else {
                            company.updateOne({ _id: ObjectID(req.body.companyId) }, { $set: { streamId: created._id } }).then((updated) => {
                                if (updated.modifiedCount === 1) {
                                    res.status(200).json({ err: false, msg: "Successfully created.", streamId: created._id });
                                } else {
                                    res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                                }
                            }).catch((err) => {
                                res.status(500).json({ err: true, msg: err });
                            });
                        }
                    }).catch((err) => {
                        res.status(500).json({ err: true, msg: err });
                    });
                } else {
                    res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                }
            }).catch((err) => {
                res.status(500).json({ err: true, msg: err });
            });
        }
    });
}