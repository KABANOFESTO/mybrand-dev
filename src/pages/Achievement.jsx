import { useEffect, useState } from 'react';
import commerce from '../assets/images/e.jpg';
import hotel from '../assets/images/hotel.jpeg';
import web from '../assets/images/web.jpg';
import solve from '../assets/images/solve.png';
import developer from '../assets/images/developer.png';

const projects = [
    {
        title: 'E-commerce Experience',
        category: 'Web Platform',
        image: commerce,
        description: 'A shopping experience focused on clean browsing, conversion-friendly layout, and clear product presentation.',
        stack: ['React', 'JavaScript', 'Responsive UI'],
        link: 'https://e-comm-team-emma25-fe.netlify.app/',
    },
    {
        title: 'Hotel Management System',
        category: 'Operations Software',
        image: hotel,
        description: 'A hospitality-oriented interface concept for reservations, guest workflows, and streamlined management tasks.',
        stack: ['Frontend UI', 'Workflow Design', 'Data Views'],
        // link: 'https://e-comm-team-emma25-fe.netlify.app/',
    },
    {
        title: 'Responsive Web Design Projects',
        category: 'Portfolio Work',
        image: web,
        description: 'A collection of modern interfaces built to remain clean, readable, and engaging on every screen size.',
        stack: ['HTML', 'CSS', 'Design Systems'],
    },
    {
        title: 'Software Training Projects',
        category: 'Technical Growth',
        image: solve,
        description: 'Hands-on programming projects developed while sharpening problem solving and implementation fundamentals.',
        stack: ['Python', 'C++', 'Logic Building'],
    },
    {
        title: 'Developer Brand Experience',
        category: 'Personal Portfolio',
        image: developer,
        description: 'A recruiter-facing portfolio experience designed to position technical ability with stronger presentation.',
        stack: ['React', 'UX Writing', '3D UI Styling'],
    },
];

const Achievement = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setCurrentIndex((current) => (current + 1) % projects.length);
        }, 5000);

        return () => window.clearInterval(interval);
    }, []);

    const goToSlide = (index) => setCurrentIndex(index);
    const nextSlide = () => setCurrentIndex((current) => (current + 1) % projects.length);
    const previousSlide = () => setCurrentIndex((current) => (current - 1 + projects.length) % projects.length);

    return (
        <section className="portfolio-section achievement-section" id="achievement">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">Projects</span>
                    <h2 className="section-title display-title">Remarkable Achievements Showcase</h2>
                    <p className="section-intro">
                        A sliding presentation of selected work so you can keep adding projects without overcrowding the page.
                    </p>
                </div>

                <div className="project-slider-shell">
                    <button type="button" className="project-slider-arrow project-slider-arrow-left" onClick={previousSlide} aria-label="Previous project">
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <div className="project-slider-window">
                        <div
                            className="project-slider-track"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {projects.map((project) => (
                                <article className="project-slide" key={project.title}>
                                    <div className="project-slide-grid">
                                        <div className="project-visual-card">
                                            <span className="project-badge">{project.category}</span>
                                            <img src={project.image} alt={project.title} className="project-image" />
                                        </div>

                                        <div className="project-content-card">
                                            <h3>{project.title}</h3>
                                            <p>{project.description}</p>

                                            <div className="project-stack">
                                                {project.stack.map((item) => (
                                                    <span key={item}>{item}</span>
                                                ))}
                                            </div>

                                            <div className="project-actions">
                                                {project.link ? (
                                                    <a href={project.link} target="_blank" rel="noreferrer" className="hero-primary-btn project-link-btn">
                                                        Live Preview
                                                    </a>
                                                ) : (
                                                    <span className="project-muted-note">Private or concept work available during interview discussion.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <button type="button" className="project-slider-arrow project-slider-arrow-right" onClick={nextSlide} aria-label="Next project">
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="project-slider-dots" aria-label="Project navigation">
                    {projects.map((project, index) => (
                        <button
                            type="button"
                            key={project.title}
                            className={`project-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to ${project.title}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievement;
