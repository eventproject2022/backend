const mongoose = require('mongoose');

const schema = mongoose.Schema;
const admin = new schema({
    companyName: { type: String, required: true },
    companyRgNo: { type: Number, required: true },
    companyType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    alternativeEmail: { type: String },
    phone: { type: Number, required: true },
    password: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    profileImage: { type: String },
},
    { versionKey: false, timestamps: true, });
module.exports = mongoose.model('admin', admin);