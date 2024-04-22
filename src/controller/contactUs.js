const { ContactUs } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

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


exports.find = async (req, res) => {
    try {
        const { role, q } = req.query;
        const searchFilter = q
            ? {
                $or: [
                    { full_name: { $regex: new RegExp(q, "i") } },
                    { email: { $regex: new RegExp(q, "i") } },
                ],
            }
            : {};

        const contacts = await ContactUs.find({ ...searchFilter });
        const totalCount = await ContactUs.countDocuments();

        const getPaginationResult = await getPagination(req.query, contacts, totalCount);

        handleResponse(res, getPaginationResult, 200);

    } catch (error) {
        handleError(error.message, 400, res);
    }
};