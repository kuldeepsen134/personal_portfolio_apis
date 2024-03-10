const { Experience } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
    try {
      const { title, companyName,description, joiningDate,leaveDate} = req.body;

  
      const data = { title, companyName,description, joiningDate,leaveDate };
  
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