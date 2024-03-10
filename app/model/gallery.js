const mongoose = require("mongoose");
const { Schema } = mongoose;

const GallerySchema = Schema(
  {
    photoes: {
      type: [String],
    },
    video: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", GallerySchema);
