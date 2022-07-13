const ObjectID = require('mongodb').ObjectId;

const admin = require('./_models/admin.model');
module.exports = (server) => {
    var io = require("socket.io")(server);
    // socket connection
    io.on("connection", (socket) => {

    });
}