import React from 'react';
import { PROJECTS } from '../utils/constants';
import '../styles/pages.css';

export default function Projects() {
  return (
    <div className="page projects-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Our Projects</h1>
          <p>Showcase of successful granite installations across India</p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects-showcase">
        <div className="container">
          <div className="projects-grid-large">
            {PROJECTS.map((project) => (
              <div key={project.id} className="project-card-large">
                <div className="project-image-wrapper">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-overlay-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </div>
                <div className="project-details">
                  <h3>{project.title}</h3>
                  <div className="project-meta">
                    <span className="meta-item">
                      <strong>Location:</strong> {project.location}
                    </span>
                    <span className="meta-item">
                      <strong>Granite:</strong> {project.graniteType}
                    </span>
                    <span className="meta-item">
                      <strong>Area:</strong> {project.area}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Statistics */}
      <section className="project-stats">
        <div className="container">
          <h2>Our Track Record</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <p>Projects Completed</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">40+</div>
              <p>Years Experience</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">600+</div>
              <p>Stone Varieties</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="project-categories">
        <div className="container">
          <h2>Project Categories</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🏠</div>
              <h3>Residential</h3>
              <p>Villas, apartments, and residential complexes</p>
              <span className="category-count">150+ Projects</span>
            </div>
            <div className="category-card">
              <div className="category-icon">🏢</div>
              <h3>Commercial</h3>
              <p>Offices, hotels, and commercial buildings</p>
              <span className="category-count">120+ Projects</span>
            </div>
            <div className="category-card">
              <div className="category-icon">🏭</div>
              <h3>Industrial</h3>
              <p>Factories and industrial applications</p>
              <span className="category-count">85+ Projects</span>
            </div>
            <div className="category-card">
              <div className="category-icon">🌳</div>
              <h3>Landscape</h3>
              <p>Outdoor and landscape designs</p>
              <span className="category-count">145+ Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>Client Testimonials</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Excellent quality and professionalism. Stoneo India delivered our project on time with outstanding attention to detail. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <strong>Rahul Sharma</strong>
                <span>Luxury Villa Project - Jaipur</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Working with Stoneo India was seamless. Their expertise in granite selection and installation guidance was invaluable for our commercial project."
              </p>
              <div className="testimonial-author">
                <strong>Priya Malik</strong>
                <span>Commercial Complex - Delhi</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Best granite supplier we've worked with. Great quality, fair pricing, and their customer service is exceptional. Will definitely work with them again!"
              </p>
              <div className="testimonial-author">
                <strong>Vikram Patel</strong>
                <span>Contractor - Multiple Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <h2>Our Process</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Consultation</h3>
              <p>Discuss project requirements and preferences</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Selection</h3>
              <p>Choose from our extensive granite collection</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Quotation</h3>
              <p>Receive detailed pricing and timeline</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Installation</h3>
              <p>Professional installation and finishing</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h3>Support</h3>
              <p>Ongoing maintenance and support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
