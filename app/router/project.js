const { projects } = require('../controller');
const { multipleFileUploading } = require('../middleware/fileUpload');

var router = require('express').Router();

module.exports = app => {
    router.post('/projects', multipleFileUploading, projects.create)
    router.get('/projects', projects.find)


    app.use('/api', router);
}