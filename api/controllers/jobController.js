module.exports = () => {
    const db = require('../../config/db');

    const controller = {};

    controller.saveJobDraft = async (req, res) => {
        await db.saveJobDraft(req.body);
        return res.send(201);
    }

    controller.getCompany = async (req, res) => {
        const company = await db.getCompany(req.params.company_id);
        return res.json(company);
    }

    return controller;
}