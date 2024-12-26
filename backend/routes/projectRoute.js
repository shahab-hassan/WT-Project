// routes/projectRoute.js
const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  createProject,
} = require("../controllers/projectController");

// GET /api/projects => retrieve all
// POST /api/projects => create a new project
router.route("/").get(getAllProjects).post(createProject);

module.exports = router;
