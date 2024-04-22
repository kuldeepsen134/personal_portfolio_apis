const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require('moment');

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
      type: Schema.Types.Mixed,
    },
    leaveDate: {
      type: Schema.Types.Mixed,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to parse string dates into Date objects before saving
ExperienceSchema.pre('save', function(next) {
  if (this.joiningDate && typeof this.joiningDate === 'string') {
    this.joiningDate = moment(this.joiningDate, "DD MMM YYYY").toDate();
  }
  if (this.leaveDate && typeof this.leaveDate === 'string') {
    this.leaveDate = moment(this.leaveDate, "DD MMM YYYY").toDate();
  }
  next();
});

module.exports = mongoose.model("Experience", ExperienceSchema);
