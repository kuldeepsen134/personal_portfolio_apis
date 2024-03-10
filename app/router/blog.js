const {  blogs } = require('../controller');
const { multipleFileUploading } = require('../middleware/fileUpload');

var router = require('express').Router();

module.exports = app => {
    router.post('/blogs', multipleFileUploading, blogs.create)
    router.get('/blogs', blogs.find)


    app.use('/api', router);
}