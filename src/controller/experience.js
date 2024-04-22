const { Experience } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
  try {
    const { title, companyName, description, joiningDate, leaveDate } = req.body;
    
    const data = { title, companyName, description, joiningDate, leaveDate };

    const newExperience = new Experience(data);
    await newExperience.save();

    handleResponse(res, newExperience._doc, 201);
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

    const experiences = await Experience.find({ ...searchFilter });


    const totalCount = await Experience.countDocuments();

    const getPaginationResult = await getPagination(req.query, experiences, totalCount);

    handleResponse(res, getPaginationResult, 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};


exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findOne({ _id: id });

    handleResponse(res, experience._doc, 200);

  } catch (error) {
    handleError(error.message, 400, res);
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, companyName, description, joiningDate, leaveDate } = req.body;

    const data = { title, companyName, description, joiningDate, leaveDate };

    const result = await Experience.findOneAndUpdate({ _id: id }, data, { new: true })
    handleResponse(res, result._doc, 'Experience has been successfully updated.', 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};


exports.delete = async (req, res) => {
  try {
      const { id } = req.params;
      const result = await Experience.findOneAndDelete({ _id: id })
      handleResponse(res, result._doc, 'Experience has been successfully deleted.', 200);

  } catch (error) {

      handleError(error.message, 400, res);
  }
};