const { Skill } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

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