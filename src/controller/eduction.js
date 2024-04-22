const { Education } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
  try {
    const { program, institute, description, passingYear, grade, endDate } = req.body;

    const data = { program, institute, description, passingYear, grade };

    const newEducation = new Education(data);
    await newEducation.save();
    handleResponse(res, newEducation._doc, 201);
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

    const educations = await Education.find({ ...searchFilter });


    const totalCount = await Education.countDocuments();

    const getPaginationResult = await getPagination(req.query, educations, totalCount);

    handleResponse(res, getPaginationResult, 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};


exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const education = await Education.findOne({ _id: id });

    handleResponse(res, education._doc, 200);

  } catch (error) {
    handleError(error.message, 400, res);
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const { program, institute, description, passingYear, grade } = req.body;

    const data = { program, institute, description, passingYear, grade };

    const result = await Education.findOneAndUpdate({ _id: id }, data, { new: true })
    handleResponse(res, result._doc, 'Education has been successfully updated.', 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};


exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Education.findOneAndDelete({ _id: id })
    handleResponse(res, result._doc, 'Education has been successfully deleted.', 200);

  } catch (error) {

    handleError(error.message, 400, res);
  }
};