const { Gallery } = require("../model");
const { handleResponse, handleError, getPagination } = require("../utils/helper");

exports.create = async (req, res) => {
    try {

        const files = req.files;

        const video = files?.video?.map((file) => `/media/${file?.filename}`);

        const photoes = files?.image?.map((file) => `/media/${file?.filename}`);

        const data = { photoes, video, };

        const newGallery = new Gallery(data);

        await newGallery.save();

        handleResponse(res, newGallery._doc, 201);
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
  
      const gallery = await Gallery.find({ ...searchFilter });
  
  
      const totalCount = await Gallery.countDocuments();
  
      const getPaginationResult = await getPagination(req.query, gallery, totalCount);
  
      handleResponse(res, getPaginationResult, 200);
    } catch (error) {
      handleError(error.message, 400, res);
    }
  };