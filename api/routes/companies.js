module.exports = app => {
    const controller = require('../controllers/companyController')();

    app.get('/companies/:company_id', controller.getCompany);
    app.get('/companies', controller.listCompanies);
}