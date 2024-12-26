// models/projectModel.js
const mongoose = require("mongoose");

// Define the Group Member sub-document schema
const groupMemberSchema = new mongoose.Schema({
  regNo: { type: String, required: true },
  name: { type: String, required: true },
});

// Define the Project schema
const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    groupMembers: [groupMemberSchema],
    githubUrl: { type: String },
    videoUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
