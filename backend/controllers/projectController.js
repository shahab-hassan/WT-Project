// controllers/projectController.js
const Project = require("../models/projectModel");

/**
 * @desc  Get all projects
 * @route GET /api/projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @desc  Create a new project
 * @route POST /api/projects
 */
exports.createProject = async (req, res) => {
  try {
    const { projectName, groupMembers, githubUrl, videoUrl } = req.body;

    // Basic validation
    if (!projectName || !groupMembers || !groupMembers.length) {
      return res
        .status(400)
        .json({ error: "Project name and at least one group member are required." });
    }

    const newProject = await Project.create({
      projectName,
      groupMembers,
      githubUrl,
      videoUrl,
    });

    // Return the newly created project
    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
