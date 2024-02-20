module.exports = app => {
    const controller = require('../controllers/jobController')();

    app.post('/job', controller.saveJobDraft);
    app.put('/job/:job_id', controller.updateJob);
    app.delete('/job/:job_id', controller.deleteJob);
    app.put('/job/:job_id/publish', controller.publishJob);
    app.put('/job/:job_id/archive', controller.archiveJob);
    app.get('/feed', controller.getFeed);
}