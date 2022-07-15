const company = require('../_controllers/company.controller');

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
    app.post('/api/company/createCompany', company.createCompany);
    app.post('/api/company/companyLogin', company.companyLogin);
    app.post('/api/company/updateCompany/:companyId', company.updateCompany);
    app.post('/api/company/deleteCompanyById/:adminId', company.deleteCompanyById);
    app.post('/api/company/searchCompanies', company.searchCompanies);
    app.get('/api/company/getAllCompanies', company.getAllCompanies);
    app.get('/api/company/getCompanyAdminId/:adminId', company.getCompanyAdminId);
}