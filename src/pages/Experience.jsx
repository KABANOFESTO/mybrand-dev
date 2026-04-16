import { useEffect, useMemo, useState } from 'react';
import solve from '../assets/images/solve.png';
import coursera from '../assets/images/coursera.png';
import andela from '/andela.png';
import auca from '/auca.jfif';

const experienceItems = [
    {
        company: 'Andela',
        role: 'Full Stack Developer Trainee',
        period: 'Dec 2022 - July 2023',
        image: andela,
        summary:
            'Completed a rigorous 7-month training program focused on full stack development, mastering both frontend and backend technologies, and building real-world projects.',
        skills: ['JavaScript', 'React', 'Node.js', 'Agile Methodology', 'Project Collaboration'],
    },
    {
        company: 'Solve It',
        role: 'Software Developer Trainee',
        period: 'May 2018 - Jan 2019',
        image: solve,
        summary:
            'Completed intensive hands-on training in programming fundamentals, software development practices, and multi-language problem solving.',
        skills: ['Python', 'C++', 'Visual Basic', 'Debugging', 'Team Collaboration'],
    },
    {
        company: 'Adventist University of Central Africa',
        role: 'Software Engineer Student',
        period: 'Jan 2022 - Dec 2026',
        image: auca,
        summary:
            'Pursuing a Bachelor of Science in Software Engineering, gaining a strong foundation in software design, development, and engineering principles through coursework and projects.',
        skills: ['Python', 'C++', 'Java', 'Database Design', 'Software Architecture'],
    },
    {
        company: 'Coursera',
        role: 'Full Stack Development Learner',
        period: 'Oct 2022 - Oct 2023',
        image: coursera,
        summary:
            'Strengthened web development skills through structured learning in frontend, backend, version control, and practical project building.',
        skills: ['JavaScript', 'Django', 'HTML/CSS', 'Git & GitHub', 'Web Projects'],
    },
];

const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 2;
    return window.innerWidth < 768 ? 1 : 2;
};

const Experience = () => {
    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const nextItemsPerPage = getItemsPerPage();
            setItemsPerPage(nextItemsPerPage);
            setCurrentPage((current) => {
                const nextTotalPages = Math.ceil(experienceItems.length / nextItemsPerPage);
                return Math.min(current, Math.max(nextTotalPages - 1, 0));
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(experienceItems.length / itemsPerPage);

    const visibleItems = useMemo(() => {
        const start = currentPage * itemsPerPage;
        return experienceItems.slice(start, start + itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const goPrevious = () => setCurrentPage((current) => (current <= 0 ? totalPages - 1 : current - 1));
    const goNext = () => setCurrentPage((current) => (current >= totalPages - 1 ? 0 : current + 1));

    return (
        <section className="portfolio-section experience-section" id="experience">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">Experience</span>
                    <h2 className="section-title display-title">Where I have been building my foundation</h2>
                    <p className="section-intro">
                        Each step sharpened my technical range and helped me build the discipline required to deliver professional work.
                    </p>
                </div>

                <div className="experience-pagination-shell">
                    <div className="experience-grid">
                        {visibleItems.map((item) => (
                            <article className="experience-card" key={item.company}>
                                <div className="experience-head">
                                    <div className="experience-logo-wrap">
                                        <img src={item.image} alt={item.company} className="experience-logo" />
                                    </div>
                                    <div>
                                        <span className="experience-company">{item.company}</span>
                                        <h3>{item.role}</h3>
                                        <p className="experience-period">{item.period}</p>
                                    </div>
                                </div>

                                <p className="experience-summary">{item.summary}</p>

                                <div className="experience-skills">
                                    {item.skills.map((skill) => (
                                        <span key={skill}>{skill}</span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="experience-pagination-controls">
                        <button type="button" className="experience-page-arrow" onClick={goPrevious} aria-label="Previous experience page">
                            <i className="bi bi-arrow-left"></i>
                        </button>

                        <div className="experience-pagination-dots">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className={`experience-page-dot ${index === currentPage ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(index)}
                                    aria-label={`Go to experience page ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button type="button" className="experience-page-arrow" onClick={goNext} aria-label="Next experience page">
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;