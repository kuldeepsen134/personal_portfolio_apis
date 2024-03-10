const { auth, users } = require('../controller');

var router = require('express').Router();

module.exports = app => {
    router.post('/register', users.create)
    router.post('/login', auth.login)

    router.post('/reset-password', auth.forgotPassword)
    router.post('/update-password', auth.forgotPasswordVerify)
    router.get('/me', auth.me)


    app.use('/api', router);
}