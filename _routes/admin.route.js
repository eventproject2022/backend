const admin = require('../_controllers/admin.controller');
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
    app.post('/api/admin/createAdmin', admin.createAdmin);
    app.post('/api/admin/login', admin.adminLogin);
    app.post('/api/admin/update/:adminId', admin.updateAdmin);
    app.post('/api/admin/searchAdmin', admin.searchAdmin);
    app.get('/api/admin/getAllAdmins', admin.getAllAdmins);
    app.get('/api/admin/getAdminById/:_id', admin.getAdminById);
    app.post('/api/admin/deleteAdminById/:adminId', admin.deleteAdminById);
}