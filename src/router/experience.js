const { experiences } = require('../controller');

var router = require('express').Router();

module.exports = app => {
    router.post('/experiences',experiences.create)
    router.get('/experiences', experiences.find)


    app.use('/api', router);
}