const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },

    short_desc: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    photoes: {
      type: [String],
      required: true,
    },

    video: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
