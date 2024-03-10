const mongoose = require("mongoose");
const { Schema } = mongoose;

const SkillSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },

    techLogo: {
      type: String,
      required: true,
    },

    totalExp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", SkillSchema);
