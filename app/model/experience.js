const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExperienceSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    joiningDate: {
      type: Date,
    },
    leaveDate: {
      type: Date,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
