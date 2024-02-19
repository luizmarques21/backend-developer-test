require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT);

    app.use(bodyParser.json());

    require('../api/routes/companies')(app);

    return app;
};