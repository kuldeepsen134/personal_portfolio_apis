const { Skill } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");
const fs = require('fs');
const path = require("path");

const BASE_PATH = path.join(__dirname, "../upload");


exports.create = async (req, res) => {
    try {
        const { title, totalExp } = req.body;
        const file = `/media/${req?.file?.filename}`;

        const data = { title, totalExp, techLogo: file };
        const newSkill = new Skill(data);

        await newSkill.save();
        handleResponse(res, newSkill._doc, 201);
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

        const skills = await Skill.find({ ...searchFilter });
        const totalCount = await Skill.countDocuments();

        const getPaginationResult = await getPagination(req.query, skills, totalCount);

        handleResponse(res, getPaginationResult, 200);

    } catch (error) {
        handleError(error.message, 400, res);
    }
};


exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findOne({ _id: id });

        handleResponse(res, skill._doc, 200);

    } catch (error) {
        handleError(error.message, 400, res);
    }
};


exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findOne({ _id: id });

        if (!skill) {
            handleError('Invalid skill Id', 400, res);
            return;
        };

        if (req?.file) {
            const filePath = skill?.techLogo?.split('/')[2]
            
            if (fs.existsSync(`${BASE_PATH}/${filePath}`)) {
                fs.unlinkSync(`${BASE_PATH}/${filePath}`);
              } else {
                console.error('File does not exist:', `${BASE_PATH}/${filePath}`);
              }
        };

        const { title, totalExp } = req.body;
        
        const file = `/media/${req?.file?.filename}`;

        const data = { title, totalExp, techLogo: file };

        const result = await Skill.findOneAndUpdate({ _id: id }, data, { new: true })

        handleResponse(res, result._doc, 'Skill has been successfully updated.', 200);

    } catch (error) {
        handleError(error.message, 400, res);
    }
};


exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findOne({ _id: id });

        if (!skill) {
            handleError('Invalid skill Id', 400, res);
            return;
        };

        if (skill) {
            const filePath = skill?.techLogo?.split('/')[2]
            fs.unlinkSync(`${BASE_PATH}/${filePath}`);
        };

        const result = await Skill.findOneAndDelete({ _id: id })
        handleResponse(res, result._doc, 'Skill has been successfully deleted.', 200);

    } catch (error) {
        handleError(error.message, 400, res);
    }
};
