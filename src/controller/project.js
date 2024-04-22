const { Project } = require("../model");
const { handleError, handleResponse, getPagination } = require("../utils/helper");

const fs = require('fs');
const path = require("path");
const BASE_PATH = path.join(__dirname, "../upload");


exports.create = async (req, res) => {
  try {

    const { title, short_desc, description, github, liveURL } = req.body;

    const media = req?.files?.map((file) => `/media/${file?.filename}`);

    const data = { title, short_desc, description, github, liveURL, media };

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
    
    const projectData = await Project.findOne({ _id: id });

    if (!projectData) {
      return handleError('Invalid project id', 400, res)
    };

      for (let i = 0; i < projectData?.media?.length; i++) {
        const fileURL = projectData?.media[i];
        const filePath = fileURL.split('/')[2]

        if (fs.existsSync(`${BASE_PATH}/${filePath}`)) {
          fs.unlinkSync(`${BASE_PATH}/${filePath}`);
        } else {
          console.error('File does not exist:', `${BASE_PATH}/${filePath}`);
        }
      };

    await Project.deleteOne({ _id: projectData._id });
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


    const projectData = await Project.findOne({ _id: id });

    if (!projectData) {
      return handleError('Invalid project id', 400, res)
    };

    const media = req?.files?.map((file) => `/media/${file?.filename}`);

    if (req?.files) {
      for (let i = 0; i < projectData.media.length; i++) {
        const fileURL = projectData.media[i];
        const filePath = fileURL.split('/')[2]

        if (fs.existsSync(`${BASE_PATH}/${filePath}`)) {
          fs.unlinkSync(`${BASE_PATH}/${filePath}`);
        } else {
          console.error('File does not exist:', `${BASE_PATH}/${filePath}`);
        }
      }
    }

    const data = { title, short_desc, description, github, liveURL, media: media, };

    const project = await Project.findOneAndUpdate({ _id: id }, data, { new: true });

    if (!project) {
      handleError('Invailid project ID', 400, res)
      return
    }

    handleResponse(res, [], 'Project has been updated successfully', 200);

  } catch (error) {
    handleError(error.message, 400, res);
  }
};