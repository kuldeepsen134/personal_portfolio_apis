const { experiences } = require('../controller');

var router = require('express').Router();

module.exports = app => {
    router.post('/experiences',experiences.create)
    router.get('/experiences', experiences.find)
    router.get('/experiences/:id', experiences.findOne)

    router.patch('/experiences/:id', experiences.update)
    router.delete('/experiences/:id', experiences.delete)



    app.use('/api', router);
}