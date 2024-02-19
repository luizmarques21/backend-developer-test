module.exports = () => {
    const db = require('../../config/db');

    const controller = {};

    controller.listCompanies = async (req, res) => {
        const companiesList = await db.listCompanies()
        return res.json(companiesList);
    }

    controller.getCompany = async (req, res) => {
        const company = await db.getCompany(req.params.company_id);
        return res.json(company);
    }

    return controller;
}