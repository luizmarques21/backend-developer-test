module.exports = app => {
    const controller = require('../controllers/jobController')();

    app.post('/job', controller.saveJobDraft);
    app.put('/job/:job_id', controller.updateJob);
    app.put('/job/:job_id/publish', controller.publishJob);
    app.put('/job/:job_id/archive', controller.archiveJob);
}