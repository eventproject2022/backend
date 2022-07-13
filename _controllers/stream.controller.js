const stream = require('../_models/stream.model');
const admin = require('../_models/admin.model');
const ObjectID = require('mongodb').ObjectId;
exports.createStream = (req, res) => {
    stream.findOne({ adminId: ObjectID(req.body.adminId) }).then((streamFound) => {
        if (streamFound == null) {
            let ins = new stream(req.body);
            ins.save().then((created) => {
                if (created == null) {
                    res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                } else {
                    admin.updateOne({ _id: ObjectID(req.body.adminId) }, { $set: { streamId: created._id } }).then((updated) => {
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
            stream.deleteOne({ adminId: req.body.adminId }).then((streamDelete) => {
                if (streamDelete.deletedCount === 1) {
                    let ins = new stream({
                        adminId: req.body.adminId,
                        isActive: req.body.isActive,
                        streamType: req.body.streamType,
                    });
                    ins.save().then((created) => {
                        if (created == null) {
                            res.status(500).json({ err: true, msg: "An error occurred, Please try again later." });
                        } else {
                            admin.updateOne({ _id: ObjectID(req.body.adminId) }, { $set: { streamId: created._id } }).then((updated) => {
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