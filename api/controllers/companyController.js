module.exports = () => {
    const db = require('../../config/db');

    const controller = {};

    controller.listCompanies = async (req, res) => {
        try {
            const companiesList = await db.listCompanies()
            return res.status(200).json(companiesList);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao consultar lista de companhias." });
        }
    }

    controller.getCompany = async (req, res) => {
        try {
            const company = await db.getCompany(req.params.company_id);
            
            if (!company) {
                return res.status(404).json({ message: 'Compainha não encontrada. '});
            }

            return res.status(200).json(company);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao consultar dados da companhia." });
        }
    }

    return controller;
}