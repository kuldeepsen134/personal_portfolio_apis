const { educations } = require('../controller');

var router = require('express').Router();

module.exports = app => {
    router.post('/educations', educations.create)
    router.get('/educations', educations.find)
    router.get('/educations/:id', educations.findOne)
    router.patch('/educations/:id', educations.update)

    router.delete('/educations/:id', educations.delete)


    app.use('/api', router);
}