const mongoose = require('mongoose');

const schema = mongoose.Schema;
const company = new schema({
    adminId: { type: mongoose.Types.ObjectId, required: true },
    companyName: { type: String, required: true },
    companyType: { type: String, required: true },
    companyRgNo: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    alternativeEmail: { type: String },
    phone: { type: Number, required: true },
    password: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    companyImage: { type: String },
    socketId: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    streamId: { type: mongoose.Types.ObjectId },
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('company', company);