const { projects } = require('../controller');
const { multipleFileUploading } = require('../middleware/fileUpload');

var router = require('express').Router();

module.exports = app => {
    router.post('/projects', multipleFileUploading, projects.create)
    router.get('/projects', projects.find)
    router.delete('/projects/:id', projects.deleteOne)
    router.get('/projects/:id', projects.findOne)

    // router.patch('/projects/:id', projects.updateOne)




    app.use('/api', router);
}