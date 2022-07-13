const mongoose = require('mongoose');

const schema = mongoose.Schema;
const superAdmin = new schema({
    email: { type: String, required: true, unique: true },
    password: String,
},
    { versionKey: false, timestamps: true, });
module.exports = mongoose.model('superAdmin', superAdmin);