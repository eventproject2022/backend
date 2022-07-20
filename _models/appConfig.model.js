const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;
const appConfig = new schema({
    userSr: { type: Number, default: 100 }
}, {
    versionKey: false
});

module.exports = mongoose.model("appConfig", appConfig);