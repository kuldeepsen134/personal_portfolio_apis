const { educations } = require('../controller');

var router = require('express').Router();

module.exports = app => {
    router.post('/educations',educations.create)
    router.get('/educations', educations.find)


    app.use('/api', router);
}