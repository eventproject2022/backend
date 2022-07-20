const mongoose = require('mongoose');

const schema = mongoose.Schema;
const user = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    password: String,
    address: { type: String },
    state: { type: String },
    country: { type: String },
},
    { versionKey: false, timestamps: true, });
module.exports = mongoose.model('user', user);