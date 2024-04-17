const { Project } = require("../model");
const { uploadOnCloudinaryArray } = require("../utils/cloudinary");
const { handleError, handleResponse, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
  try {

    const { title, short_desc, description, github, liveURL } = req.body;

    // const localVideoFilePath = req?.files?.video?.map((file) => file?.path);
    // const videos = await uploadOnCloudinaryArray(localVideoFilePath);
    // const videoUrls = videos?.map((video) => video.url)
    const localFilePath = req?.files?.image?.map((file) => file?.path);
    const images = await uploadOnCloudinaryArray(localFilePath);
    const imageUrl = images.map((image) => image.url)

    const data = { title, short_desc, description, github, liveURL, photoes: imageUrl, };

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

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findOne({ _id: id });

    handleResponse(res, project._doc, 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};



// For admin only
exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id });

    if (!project) {
      handleError('Invailid project ID', 400, res)
      return
    }

    await Project.deleteOne({ _id: project._id })

    handleResponse(res, [], 'Project deleted successfully', 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};


// For admin only
exports.updateOne = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, short_desc, description, github, liveURL } = req.body;

    // const video = files?.video?.map((file) => `/media/${file?.filename}`);

    const localFilePath = req?.files?.image?.map((file) => file?.path);
    const images = await uploadOnCloudinaryArray(localFilePath);
    const imageUrl = images?.map((image) => image?.url)

    const data = { title, short_desc, description, github, liveURL, photoes: imageUrl, };

    const project = await Project.findAndUpdateOne({ _id: id }, data, { new: true });

    if (!project) {
      handleError('Invailid project ID', 400, res)
      return
    }

    handleResponse(res, [], 'Project has been updated successfully', 200);

  } catch (error) {
    handleError(error.message, 400, res);
  }
};