module.exports = app => {
    const controller = require('../controllers/jobController')();

    app.post('/job', controller.saveJobDraft);
    app.put('/job/:job_id', controller.updateJob);
}