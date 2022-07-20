const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;
const appConfig = new schema({
    userSr: { type: Number, default: 2010050 },
    companySr: { type: Number, default: 50400 },
}, {
    versionKey: false
});

module.exports = mongoose.model("appConfig", appConfig);