// client/src/Pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Filter, Github, Youtube, Home } from 'lucide-react';
import { backendHostName } from '../utils/constants';

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);   // For fetching projects
  const [isSubmitting, setIsSubmitting] = useState(false); // For submitting new project

  const [newProject, setNewProject] = useState({
    projectName: "",
    groupMembers: [{ regNo: "", name: "" }],
    githubUrl: "",
    videoUrl: ""
  });

  // Fetch all projects from the backend API
  useEffect(() => {
    fetch(`${backendHostName}/api/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false); // Done fetching
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setIsLoading(false); // Even if error, stop loader
      });
  }, []);

  // Add a new group member (max 3)
  const handleAddMember = () => {
    if (newProject.groupMembers.length < 3) {
      setNewProject(prev => ({
        ...prev,
        groupMembers: [...prev.groupMembers, { regNo: "", name: "" }]
      }));
    }
  };

  // Remove a member by index, ensuring at least 1 remains
  const handleRemoveMember = (index) => {
    if (newProject.groupMembers.length > 1) {
      const updatedMembers = [...newProject.groupMembers];
      updatedMembers.splice(index, 1);
      setNewProject(prev => ({ ...prev, groupMembers: updatedMembers }));
    }
  };

  // Handle member input change
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = newProject.groupMembers.map((member, i) => {
      if (i === index) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setNewProject({ ...newProject, groupMembers: updatedMembers });
  };

  // Form submit (POST new project)
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent full page reload
    setIsSubmitting(true); // Start submitting

    fetch(`${backendHostName}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject)
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmitting(false); // Done submitting

        // Check if there was an error
        if (data.error) {
          alert(data.error);
        } else {
          // Successfully created project
          setProjects([...projects, data]);
          // Close the form after submission
          setIsModalOpen(false);
          // Reset form
          setNewProject({
            projectName: "",
            groupMembers: [{ regNo: "", name: "" }],
            githubUrl: "",
            videoUrl: ""
          });
        }
      })
      .catch(err => {
        setIsSubmitting(false);
        console.error("Error adding project:", err);
      });
  };

  // Download JSON
  const downloadJson = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "projects.json";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="header">
          <h1 className="dashboard-title">BSE 5th Semester Projects</h1>

          <div className="button-container">
            {/* Add Project */}
            <button
              className="button button-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} />
              Add Project
            </button>

            {/* Toggle JSON / Back to Home */}
            <button
              className="button button-secondary"
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? (
                <>
                  <Home size={20} />
                  Back to Home
                </>
              ) : (
                <>
                  <Filter size={20} />
                  View JSON
                </>
              )}
            </button>

            {/* Download JSON */}
            <button className="button button-secondary" onClick={downloadJson}>
              <Download size={20} />
              Download JSON
            </button>
          </div>
        </div>

        {/* If currently loading, show a spinner instead of the UI */}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p style={{ marginTop: "1rem", color: "#4b5563" }}>Loading Projects...</p>
          </div>
        ) : (
          <>
            {showJson ? (
              /* JSON View */
              <div className="json-container">
                <pre className="json-content">
                  {JSON.stringify(projects, null, 2)}
                </pre>
              </div>
            ) : (
              <>
                {/* If no projects, show a default message */}
                {projects?.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: "2rem" }}>
                    <h3>No projects available yet.</h3>
                  </div>
                ) : (
                  /* Projects Grid */
                  <div className="projects-grid">
                    {projects?.map((project) => (
                      <div key={project._id} className="project-card">
                        <h2 className="project-title">
                          <span style={{ fontSize: "1rem", color: "gray" }}>
                            Project Title:
                          </span>{" "}
                          {project.projectName}
                        </h2>

                        <div className="members-section">
                          <h3 className="members-title">Group Members</h3>
                          <div className="member-list">
                            {project.groupMembers?.map((member, index) => (
                              <div key={index} className="member-item">
                                <div className="member-name">{member.name}</div>
                                <div className="member-reg">{member.regNo}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="links-container">
                          {project.githubUrl && (
                            <Link
                              to={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-button github-link"
                            >
                              <Github size={20} />
                              View Repository
                            </Link>
                          )}
                          {project.videoUrl && (
                            <Link
                              to={project.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-button youtube-link"
                            >
                              <Youtube size={20} />
                              Watch Demo
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Modal for adding a project */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Project</h2>
                <button className="close-button" onClick={() => setIsModalOpen(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                {/* Project Name */}
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={newProject.projectName}
                    onChange={(e) =>
                      setNewProject({ ...newProject, projectName: e.target.value })
                    }
                    placeholder="Enter project name"
                  />
                </div>

                {/* Group Members */}
                {newProject.groupMembers?.map((member, index) => (
                  <div key={index} className="member-form">
                    <h4 className="form-label">Member {index + 1}</h4>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Registration Number"
                        required
                        value={member.regNo}
                        onChange={(e) =>
                          handleMemberChange(index, "regNo", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Name"
                        required
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, "name", e.target.value)
                        }
                      />
                    </div>

                    {/* Show remove button if more than 1 member */}
                    {newProject.groupMembers.length > 1 && (
                      <button
                        type="button"
                        className="button button-secondary"
                        style={{ width: "100%", marginBottom: "1rem" }}
                        onClick={() => handleRemoveMember(index)}
                      >
                        Remove Member
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Member (up to 3) */}
                {newProject.groupMembers.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="button button-secondary"
                    style={{ width: "100%", marginBottom: "1rem" }}
                  >
                    <Plus size={20} />
                    Add Member
                  </button>
                )}

                {/* GitHub URL */}
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="url"
                    className="form-input"
                    required
                    value={newProject.githubUrl}
                    onChange={(e) =>
                      setNewProject({ ...newProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                  />
                </div>

                {/* YouTube URL */}
                <div className="form-group">
                  <label className="form-label">YouTube Video URL</label>
                  <input
                    type="url"
                    className="form-input"
                    required
                    value={newProject.videoUrl}
                    onChange={(e) =>
                      setNewProject({ ...newProject, videoUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="button button-primary"
                  style={{ width: "100%" }}
                  disabled={isSubmitting} // Disable if currently submitting
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ======================= FIXED FOOTER ======================= */}
      <footer className="footer">
        <p>
          Copyright © 2024 Students WT Projects - All Rights Reserved -
          <span className="developer-name">
            Shahab Hassan
          </span>
          |
          <span className="developer-name">
            Daud Bin Nasar
          </span>
        </p>
      </footer>

    </>
  );
};

export default ProjectDashboard;
