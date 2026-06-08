import { useEffect, useRef, useState } from 'react';

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

const getCardsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
};

const AiTools = () => {
    const [cardsPerView, setCardsPerView] = useState(getCardsPerView);
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            const nextCardsPerView = getCardsPerView();
            setCardsPerView(nextCardsPerView);
            setCurrentIndex((current) => Math.min(current, Math.max(tools.length - nextCardsPerView, 0)));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(tools.length - cardsPerView, 0);
    const goPrevious = () => setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
    const goNext = () => setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));

    const handleTouchStart = (event) => {
        touchStartX.current = event.changedTouches[0].clientX;
    };

    const handleTouchMove = (event) => {
        touchEndX.current = event.changedTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartX.current - touchEndX.current;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            goNext();
        } else if (swipeDistance < -swipeThreshold) {
            goPrevious();
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    return (
        <section className="portfolio-section ai-tools-section" id="ai-tools">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">AI Tools</span>
                    <h2 className="section-title display-title">AI/ML Tools for Candidate Success</h2>
                    <p className="section-intro">
                        A professional toolkit for improving code quality, understanding your strengths, preparing documents,
                        and practicing for interviews with more confidence.
                    </p>
                </div>

                <div className="ai-tools-carousel-shell">
                    <button type="button" className="ai-tools-carousel-arrow" onClick={goPrevious} aria-label="Previous AI tool">
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <div className="ai-tools-carousel-window" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                        <div
                            className="ai-tools-grid ai-tools-carousel-track"
                            style={{ transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)` }}
                        >
                            {tools.map((tool) => (
                                <div className="ai-tool-slide" key={tool.title} style={{ width: `${100 / cardsPerView}%` }}>
                                    <article className="ai-tool-card">
                                        <div className="ai-tool-image-shell">
                                            <img src={tool.image} alt={tool.title} className="ai-tool-image" />
                                            <div className="ai-tool-image-overlay">
                                                <span>AI Feature</span>
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
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="button" className="ai-tools-carousel-arrow" onClick={goNext} aria-label="Next AI tool">
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="ai-tools-carousel-dots">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            className={`ai-tools-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to AI tool set ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AiTools;
