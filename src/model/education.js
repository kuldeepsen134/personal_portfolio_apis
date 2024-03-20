const mongoose = require("mongoose");
const { Schema } = mongoose;

const EducationSchema = Schema(
  {
    program: {
      type: String,
      required: true,
    },

    institute: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
    },
    endDate: {
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

module.exports = mongoose.model("Education", EducationSchema);
