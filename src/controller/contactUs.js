const { ContactUs } = require("../model");
const { handleResponse, handleError } = require("../utils/helper");

exports.create = async (req, res) => {
    try {
        const { name, title, mobile, email, message } = req.body;
        const data = { name, title, mobile, email, message };

        const newContact = new ContactUs(data);

        await newContact.save();

        const datad = { ...newContact };

        handleResponse(res, datad._doc, 201);
    } catch (error) {

        handleError(error.message, 400, res);
    }
};
