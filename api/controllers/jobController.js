const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

const NodeCache = require('node-cache');
const myCache = new NodeCache();

module.exports = () => {
    const db = require('../../config/db');

    const controller = {};

    controller.saveJobDraft = async (req, res) => {
        try {
            const { company_id, title, description, location } = req.body;
            if (!title || !description || !location) {
                return res.status(400).json({ message: 'Campos obrigatórios não informados.' });
            }

            const company = await db.getCompany(company_id);
            if (!company) {
                return res.status(400).json({ message: 'ID da compainha é inválido.' });
            }
            
            await db.saveJobDraft(req.body);
            return res.status(201).json({ message: 'Job cadastrado com sucesso.' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao criar job." });
        }
    }

    controller.updateJob = async (req, res) => {
        try {
            const { title, description, location } = req.body;
            if (!title || !description || !location) {
                return res.status(400).json({ message: 'Campos obrigatórios não informados.' });
            }
            
            const newJob = {
                id: req.params.job_id,
                title: title,
                location: location,
                description: description
            }
            await db.updateJob(newJob);
            return res.status(200).json({ message: 'Job atualizado com sucesso. '});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao atualizar job." });
        }
    }

    controller.publishJob = async (req, res) => {
        try {
            const { job_id } = req.params;
            
            const job = await db.getJob(job_id);
            if (!job) {
                return res.status(400).json({ message: 'Job não encontrado.' });
            }

            if (job.status == 'published') {
                return res.status(400).json({ message: 'O job informado já está publicado.' });
            }
            
            await db.publishJob(job_id);
            return res.status(200).json({ message: 'Job publicado com sucesso. '});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao publicar job." });
        }
    }

    controller.archiveJob = async (req, res) => {
        try {
            const { job_id } = req.params;
            
            const job = await db.getJob(job_id);
            if (!job) {
                return res.status(400).json({ message: 'Job não encontrado.' });
            }

            if (job.status == 'archived') {
                return res.status(400).json({ message: 'O job informado já está arquivado.' });
            }
            
            await db.archiveJob(job_id);
            return res.status(200).json({ message: 'Job arquivado com sucesso. '});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao arquivar job." });
        }
    }

    controller.deleteJob = async (req, res) => {
        try {
            const { job_id } = req.params;
            
            const job = await db.getJob(job_id);
            if (!job) {
                return res.status(400).json({ message: 'Job não encontrado.' });
            }
            
            await db.deleteJob(job_id);
            return res.status(204).json({ message: 'Job apagado com sucesso. '});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao apagar job." });
        }
    }

    controller.getFeed = async (req, res) => {
        try {
            let content = myCache.get('jobFeed');

            if (content == undefined) {
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: process.env.JOBS_OBJECT_KEY
                };
                const data = await s3.getObject(params).promise();
                content = JSON.parse(data.Body.toString());
                myCache.set('jobFeed', content, 60);
            }

            return res.status(200).json(content);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro ao consultar os jobs publicados.' });
        }
    }

    return controller;
}