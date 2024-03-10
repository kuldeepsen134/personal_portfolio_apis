const { galleries } = require('../controller');
const { multipleFileUploading } = require('../middleware/fileUpload');

var router = require('express').Router();

module.exports = app => {
    router.post('/galleries', multipleFileUploading, galleries.create)
    router.get('/galleries', galleries.find)


    app.use('/api', router);
}