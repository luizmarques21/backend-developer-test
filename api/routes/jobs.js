module.exports = app => {
    const controller = require('../controllers/jobController')();

    app.post('/job', controller.saveJobDraft);
}