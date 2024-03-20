const { Education } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
    try {
      const { program, institute,description, startDate,endDate} = req.body;

  
      const data = { program, institute,description, startDate,endDate };
  
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