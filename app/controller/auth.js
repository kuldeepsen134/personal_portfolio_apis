const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

const { User } = require('../model');
const { handleError, createUUID, sendMailer, handleResponse, generateResetPasswordEmail } = require('../utils/helper');
const { JWT_EXPIRESIN, JWT_SECREATE, FRONTEND_URL } = require('../config/config');

const { loginUser, updateUserPassword, resetUserPassword } = require('./validator/userJoiSchema');


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const { error } = loginUser.validate(req.body, { abortEarly: false })
        if (error) {
            handleError(error, 400, res)
            return;
        }

        const user = await User.findOne({ email })

        if (!user || !(await user.matchPassword(password))) {

            handleError('Invalid login credentials', 400, res);
            return;
        }
        else {
            const token = jwt.sign({
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            }, JWT_SECREATE, { expiresIn: JWT_EXPIRESIN })

            handleResponse(res, { token: token }, 'LoggedIn Successfully!', 200,)
        }

    }
    catch (error) {
        handleError(error, 400, res)
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { error } = resetUserPassword.validate(req.body, { abortEarly: false });

        if (error) {
            handleError(error, 400, res);
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            handleError('Invalid email address', 400, res);
            return;
        }

        const token = createUUID();
        await User.updateOne({ _id: user._id }, { token: token }, { new: true });

        const subject = 'Your forgot password link';
        const message = generateResetPasswordEmail(token);

        sendMailer(email, subject, message, res);

        return res.send({ message: `We have sent reset password email link`, error: false });
    } catch (error) {
        handleError(error.message, 400, res);
    }
};

// Forgot password verify
exports.forgotPasswordVerify = async (req, res) => {
    try {
        const { newPassword, confirmPassword, token } = req.body

        const { error } = updateUserPassword.validate(req.body, { abortEarly: false })
        if (error) {
            handleError(error, 400, res)
            return
        }

        const user = await User.findOne({ token: token })

        if (!user) {
            return res.status(409).send({ message: 'This link has already been used', error: true })
        }

        if (newPassword === confirmPassword) {
            const updatePassword = await bcrypt.hash(newPassword, 10);
            await User.updateOne({ token: token, _id: user._id }, { token: null, password: updatePassword }, { new: true })
                .then(data => {
                    return res.send({ message: 'You have successfully reset your password', error: false })
                })
                .catch(err => {
                    handleError(err.message, 400, res);
                    return
                })
        }
        else
            return handleError('Password and confirm password should be same.', 400, res);

    } catch (error) {
        handleError(error.message, 400, res);
    }
}

// Me
exports.me = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    user === null ? handleError('Unauthorized user', 400, res) : handleResponse(res, user._doc, 200)
}