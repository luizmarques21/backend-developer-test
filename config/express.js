require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT);

    app.use(bodyParser.json());
    app.use(morgan('combined'));

    require('../api/routes/companies')(app);
    require('../api/routes/jobs')(app);

    return app;
};