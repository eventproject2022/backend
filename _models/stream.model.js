const mongoose = require('mongoose');

const schema = mongoose.Schema;
const stream = new schema({
    companyId: { type: mongoose.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: false },
    streamType: { type: String, enum: ["audio", "video"] },
    viewers: Array,
    startAt: { type: Date },
    endAt: { type: Date },
    isActive: { type: Boolean, default: false },
    roomId: { type: String },
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('stream', stream);