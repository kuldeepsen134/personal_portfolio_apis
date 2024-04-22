const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = Schema(
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

    media: {
      type: [String], // Define photoes as an array of strings
      required: true,
    },

    github: {
      type: String,
    },

    liveURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
