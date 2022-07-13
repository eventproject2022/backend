const mongoose = require('mongoose');

const schema = mongoose.Schema;
const user = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: String,
    address: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
},
    { versionKey: false, timestamps: true, });
module.exports = mongoose.model('user', user);