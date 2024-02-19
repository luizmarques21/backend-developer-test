module.exports = () => {
    const db = require('../../config/db');

    const controller = {};

    controller.saveJobDraft = async (req, res) => {
        await db.saveJobDraft(req.body);
        return res.sendStatus(201);
    }

    controller.updateJob = async (req, res) => {
        const newJob = {
            id: req.params.job_id,
            title: req.body.title,
            location: req.body.location,
            description: req.body.description
        }
        await db.updateJob(newJob);
        return res.sendStatus(200);
    }

    controller.publishJob = async (req, res) => {
        await db.publishJob(req.params.job_id);
        return res.sendStatus(200);
    }

    controller.archiveJob = async (req, res) => {
        await db.archiveJob(req.params.job_id);
        return res.sendStatus(200);
    }

    controller.deleteJob = async (req, res) => {
        await db.deleteJob(req.params.job_id);
        return res.sendStatus(204);
    }

    return controller;
}