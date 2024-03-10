const { Blog } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
    try {
      const { title, short_desc, description} = req.body;
  
      const files = req.files;
  
      const video = files?.video?.map((file) => `/media/${file?.filename}`);
  
      const photoes = files?.image?.map((file) => `/media/${file?.filename}`);
  
      const data = { title, short_desc, description, photoes, video, };
  
      const newProject = new Blog(data);
  
      await newProject.save();
  
      handleResponse(res, newProject._doc, 201);
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
  
      const blogs = await Blog.find({ ...searchFilter });
  
  
      const totalCount = await Blog.countDocuments();
  
      const getPaginationResult = await getPagination(req.query, blogs, totalCount);
  
      handleResponse(res, getPaginationResult, 200);
    } catch (error) {
      handleError(error.message, 400, res);
    }
  };