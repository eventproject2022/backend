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

    io.on("connection", (socket) => {
        // emit the join stream
        socket.on('join_stream', async (viewer) => {
            socket.join(viewer.streamId);
            stream.findOne({ _id: ObjectID(viewer.streamId) }).then((streamFound) => {
                if (streamFound == null) {
                    io.sockets.emit('stream_Broadcast', { err: true, msg: "Invalid stream Id." });
                } else {
                    stream.updateOne({ _id: ObjectID(viewer.streamId) }, { $push: { viewers: ObjectID(viewer.userId) } }).then((streamUpdated) => {
                        console.log(streamUpdated)
                        if (streamUpdated.modifiedCount == 1) {
                            io.sockets.emit('stream_Broadcast', { err: false, msg: " Another User join stream" });
                        } else {
                            io.sockets.emit('stream_Broadcast', { err: true, msg: "stream already updated." });
                        }
                    }).catch((err) => {
                        io.sockets.emit('stream_Broadcast', { err: true, msg: "Invalid stream Id." });
                    });
                }
            });
        });
        // emit start stream
        socket.on('start_stream', (streamObj) => {
            stream.findOne({ _id: ObjectID(streamObj.streamId) }).then((streamFound) => {
                if (streamFound == null) {
                    socket.emit('start_streaming', { err: true, msg: 'Stream not found.' });
                } else {
                    if (streamFound.startAt == undefined) {
                        var startTime = moment(moment().utcOffset("+05:30").format());
                        stream.updateOne({ _id: streamObj.streamId }, { startAt: startTime }).then((updated) => {
                            if (updated.nModified === 1) {
                                socket.emit('start_streaming', { err: false, msg: 'Successfully update stream start time.' });
                            } else {
                                socket.emit('start_streaming', { err: true, msg: 'An error has occurred while updated Start time.' });
                            }
                        }).catch((err) => {
                            socket.emit('start_streaming', { err: true, msg: err });
                        });
                    }
                }
            }).catch((err) => {
                socket.emit('start_streaming', { err: true, msg: err });
            });
        });

        // emit end stream
        socket.on('end_stream', (streamObj) => {
            stream.findOne({ _id: ObjectID(streamObj.streamId) }).then((streamFound) => {
                if (streamFound == null) {
                    socket.emit('end_streaming', { err: true, msg: 'Stream not found.' });
                } else {
                    var endTime = moment(moment().utcOffset("+05:30").format());
                    stream.updateOne({ _id: streamFound._id }, { endAt: endTime }).then((streamFound) => {
                        socket.emit('end_streaming', { err: false, msg: 'Stream Successfully ended.' });
                    }).catch((err) => {
                        socket.emit('end_streaming', { err: true, msg: err });
                    });
                }
            }).catch((err) => {
                socket.emit('end_streaming', { err: true, msg: err });
            });
        });
    });
}