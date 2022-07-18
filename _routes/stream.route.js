const stream = require('../_controllers/stream.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Acc' + 'ess-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        res.header('Content-Type', 'application/json; charset=utf-8');
        next();
    });
    app.post('/api/stream/createStream', stream.createStream);
    app.post('/api/stream/zegoStreamCreated', stream.zegoStreamCreated);
    app.post('/api/stream/zegoStreamClosed', stream.zegoStreamClosed);
    app.get('/api/stream/getAll', stream.getAllStreams);
}