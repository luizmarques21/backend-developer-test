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
            console.log('error',error);
            return res.status(500).json({ message: 'Erro ao consultar os jobs publicados.' });
        }
    }

    return controller;
}