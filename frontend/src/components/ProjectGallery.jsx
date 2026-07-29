import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../utils/constants';
import '../styles/ProjectGallery.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const modalContentRef = useRef(null);
  const modalBackdropRef = useRef(null);

  // 6 recent projects from constants (or fallback if fewer)
  const allProjects = PROJECTS && PROJECTS.length ? PROJECTS.slice(0, 6) : [];

  // Initial ScrollTrigger entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header and Subtitle Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }

      // Bento Cards Stagger Entrance
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 60, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP Modal Open Animation
  const openDossier = (project) => {
    setSelectedProject(project);
    requestAnimationFrame(() => {
      if (modalBackdropRef.current && modalContentRef.current) {
        gsap.fromTo(
          modalBackdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          modalContentRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power3.out" }
        );
      }
    });
  };

  // GSAP Modal Close Animation
  const closeDossier = () => {
    if (modalBackdropRef.current && modalContentRef.current) {
      gsap.to(modalContentRef.current, {
        opacity: 0,
        scale: 0.92,
        y: 20,
        duration: 0.25,
        ease: "power2.in"
      });
      gsap.to(modalBackdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setSelectedProject(null);
        }
      });
    } else {
      setSelectedProject(null);
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section className="project-gallery-section" ref={sectionRef} id="project-gallery">
      <div className="pg-container">
        {/* Header Section */}
        <div className="pg-header" ref={headerRef}>
          <div className="pg-tag">
            <span>✦</span> Architectural Landmark Dossier
          </div>
          <h2 className="pg-title">
            Crafting Earth’s <span>Timeless Masterpieces</span>
          </h2>
          <p className="pg-subtitle">
            Explore 6 of our most celebrated architectural collaborations across India—from monolithic hotel lobbies and luxury residential estates to precision-engineered stone facades.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="pg-grid" ref={gridRef}>
          {allProjects.map((project) => (
            <div
              key={project.id}
              className="pg-card"
              onClick={() => openDossier(project)}
            >
              <div className="pg-card-img-wrap">
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                  }}
                  loading="lazy"
                />
              </div>

              {/* Floating Top Badges */}
              <div className="pg-card-top-badges">
                <span className="pg-badge-category">{project.category}</span>
                <span className="pg-badge-year">{project.year || '2025'}</span>
              </div>

              {/* Gradient Bottom Overlay */}
              <div className="pg-card-overlay">
                <span className="pg-stone-tag">{project.stoneUsed}</span>
                <h3 className="pg-card-title">{project.title}</h3>
                <p className="pg-card-location">📍 {project.location}</p>
                <div className="pg-card-footer">
                  <span>Area: {project.area}</span>
                  <span className="pg-explore-pill">View Dossier →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Dossier Modal */}
      {selectedProject && (
        <div
          className="pg-modal-backdrop"
          ref={modalBackdropRef}
          onClick={(e) => {
            if (e.target === modalBackdropRef.current) {
              closeDossier();
            }
          }}
        >
          <div className="pg-modal-content" ref={modalContentRef}>
            <button className="pg-modal-close-btn" onClick={closeDossier} aria-label="Close">
              ×
            </button>

            <div className="pg-modal-image-col">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>

            <div className="pg-modal-info-col">
              <span className="pg-modal-category">✦ {selectedProject.category} Project Dossier</span>
              <h3 className="pg-modal-title">{selectedProject.title}</h3>
              <p className="pg-modal-location">📍 {selectedProject.location}</p>

              <p className="pg-modal-description">
                {selectedProject.description}
              </p>

              <div className="pg-specs-grid">
                <div className="pg-spec-item">
                  <h5>Primary Stone Used</h5>
                  <p>{selectedProject.stoneUsed}</p>
                </div>
                <div className="pg-spec-item">
                  <h5>Total Installed Area</h5>
                  <p>{selectedProject.area}</p>
                </div>
                <div className="pg-spec-item">
                  <h5>Completion Year</h5>
                  <p>{selectedProject.year || '2025'}</p>
                </div>
                <div className="pg-spec-item">
                  <h5>Architectural Atelier</h5>
                  <p>{selectedProject.architect || 'Stoneo Bespoke Studio'}</p>
                </div>
              </div>

              <div className="pg-modal-cta-wrap">
                <button
                  className="pg-modal-btn-primary"
                  onClick={() => {
                    closeDossier();
                    navigate('/contact', { state: { project: selectedProject } });
                  }}
                >
                  Request Similar Slab Consultation
                </button>
                <button
                  className="pg-modal-btn-secondary"
                  onClick={() => {
                    closeDossier();
                    navigate('/products');
                  }}
                >
                  Explore Stone Collections
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
