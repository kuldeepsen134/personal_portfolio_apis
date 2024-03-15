const { Project } = require("../model");
const { handleError, handleResponse, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
  try {
    const { title, short_desc, description, github, liveURL } = req.body;

    const files = req.files;

    const video = files?.video?.map((file) => `/media/${file?.filename}`);

    const photoes = files?.image?.map((file) => `/media/${file?.filename}`);

    const data = { title, short_desc, description, github, liveURL, photoes, video, };

    const newProject = new Project(data);

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

    const users = await Project.find({ ...searchFilter });


    const totalCount = await Project.countDocuments();

    const getPaginationResult = await getPagination(req.query, users, totalCount);

    handleResponse(res, getPaginationResult, 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};