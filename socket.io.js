const ObjectID = require('mongodb').ObjectId;
const stream = require('./_models/stream.model');
const admin = require('./_models/admin.model');
module.exports = (myObject) => {
    let server = myObject.server
    let app = myObject.app
    var io = require("socket.io")(server, {
        transports: ['websocket'],
        allowUpgrades: false,
        pingInterval: 25000,
        pingTimeout: 60000,
    });
    app.set('socketio', io);
    // emit the join stream
    io.on('join_stream', async (viewer) => {
        socket.join(viewer.streamId);
        stream.findOne({ _id: ObjectID(viewer.streamId) }).then((streamFound) => {
            if (streamFound == null) {
                socket.emit('join_stream_viewers', { err: true, msg: "Invalid stream Id." });
            } else {
                io.emit('join_stream_viewers', { err: false, msg: " Another User join stream" });
            }
        });
    });
}