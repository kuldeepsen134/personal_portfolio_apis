const jwt = require("jsonwebtoken");

const { User } = require("../model");
const { JWT_EXPIRESIN, JWT_SECREATE } = require("../config/config");

const { handleError, handleResponse, getPagination, } = require("../utils/helper");
const { registerUser, updateUser, updateUserProfile, } = require("./validator/userJoiSchema");

const fs = require('fs');
const path = require("path");
const BASE_PATH = path.join(__dirname, "../upload");




// User can sign-up
exports.create = async (req, res) => {
  try {
    const { full_name, title, mobile, email, password, aboutUs, totalExp } = req.body;
    const { error } = registerUser.validate(req.body, { abortEarly: false });

    if (error) {
      handleError(error, 400, res);
      return;
    }

    const file = `/media/${req?.file?.filename}`;

    const data = { full_name, title, aboutUs, mobile, email, password, profile: file, totalExp };

    const token = jwt.sign({ data }, JWT_SECREATE, { expiresIn: JWT_EXPIRESIN, });

    const newUser = new User(data);

    await newUser.save();

    const datad = { ...newUser._doc, token };

    handleResponse(res, datad, 201);
  } catch (error) {
    if (error.code === 11000) {
      handleError("This email is already exists.", 400, res);
      return;
    }
    handleError(error.message, 400, res);
  }
};


// For admin only
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

    const users = await User.find({ ...searchFilter });

    const getUsers = users.filter((user) => user.role !== "admin");

    const totalCount = await User.countDocuments();

    const getPaginationResult = await getPagination(
      req.query,
      getUsers,
      totalCount
    );

    handleResponse(res, getPaginationResult, 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};

// For admin only
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    handleResponse(res, user._doc, 200);
  } catch (error) {
    handleError(error.message, 400, res);
  }
};


// For admin only
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, title, mobile, email, password, aboutUs, address, city, state, totalExp } = req.body;
    let data = ''

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      handleError('Invalid user Id', 400, res);
      return;
    };

    if (req?.file) {
      
      const file = `/media/${req?.file?.filename}`;
      data = { full_name, title, aboutUs, mobile, email, password, profile: file, address, city, state, totalExp }
      
      const filePath = user?.profile?.split('/')[2]


      if (fs.existsSync(`${BASE_PATH}/${filePath}`)) {
        fs.unlinkSync(`${BASE_PATH}/${filePath}`);
      } else {
        console.error('File does not exist:', `${BASE_PATH}/${filePath}`);
      }

    }
    else {
      data = { full_name, title, aboutUs, mobile, email, password, address, city, state, totalExp };
    }

    await User.findOneAndUpdate({ _id: req.user._id }, data, { new: true })

    handleResponse(res, [], "Profile updated here.", 202);
  } catch (error) {
    handleError(error, 400, res);
  }
};