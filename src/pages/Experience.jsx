import solve from '../assets/images/solve.png';
import coursera from '../assets/images/coursera.png';

const experienceItems = [
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
        company: 'Coursera',
        role: 'Full Stack Development Learner',
        period: 'Oct 2022 - Oct 2023',
        image: coursera,
        summary:
            'Strengthened web development skills through structured learning in frontend, backend, version control, and practical project building.',
        skills: ['JavaScript', 'Django', 'HTML/CSS', 'Git & GitHub', 'Web Projects'],
    },
];

const Experience = () => {
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

                <div className="experience-grid">
                    {experienceItems.map((item) => (
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
            </div>
        </section>
    );
};

export default Experience;
