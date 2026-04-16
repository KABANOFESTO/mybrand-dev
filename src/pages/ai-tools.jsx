const codeReviewImage = '/code-review.jpg';
const skillAnalyzerImage = '/skill-analyzer.jpg';
const resumeGeneratorImage = '/ai-resume.png';
const interviewSimulatorImage = '/ai.jfif';

const tools = [
    {
        icon: 'bi-code-slash',
        title: 'AI Code Review',
        description: 'Get fast feedback on code quality, readability, structure, and improvement opportunities before shipping.',
        image: codeReviewImage,
    },
    {
        icon: 'bi-bar-chart-line',
        title: 'Skill Analyzer',
        description: 'Evaluate your strengths, identify gaps, and understand which skills need more focus for your target role.',
        image: skillAnalyzerImage,
    },
    {
        icon: 'bi-file-earmark-text',
        title: 'Resume Generator',
        description: 'Turn your experience into a cleaner, recruiter-ready resume tailored for technical roles and real applications.',
        image: resumeGeneratorImage,
    },
    {
        icon: 'bi-chat-square-dots',
        title: 'Interview Simulator',
        description: 'Practice realistic interview questions, sharpen answers, and build more confidence before the real conversation.',
        image: interviewSimulatorImage,
    },
];

const AiTools = () => {
    return (
        <section className="portfolio-section ai-tools-section" id="ai-tools">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">AI Tools</span>
                    <h2 className="section-title display-title">Practical AI features designed to help candidates stand out</h2>
                    <p className="section-intro">
                        A professional toolkit for improving code quality, understanding your strengths, preparing documents,
                        and practicing for interviews with more confidence.
                    </p>
                </div>

                <div className="ai-tools-grid">
                    {tools.map((tool) => (
                        <article className="ai-tool-card" key={tool.title}>
                            <div className="ai-tool-image-shell">
                                <img src={tool.image} alt={tool.title} className="ai-tool-image" />
                                <div className="ai-tool-image-overlay">
                                    <span>Enjoy Life With Me!👨</span>
                                </div>
                            </div>
                            <div className="ai-tool-icon-wrap">
                                <i className={`bi ${tool.icon}`}></i>
                            </div>
                            <h3>{tool.title}</h3>
                            <p>{tool.description}</p>
                            <a href="/signup" className="ai-tool-btn">
                                Try now
                                <i className="bi bi-arrow-up-right"></i>
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AiTools;
