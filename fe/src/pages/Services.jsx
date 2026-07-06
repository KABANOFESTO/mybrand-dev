import { useEffect, useState } from 'react';

const services = [
    {
        icon: 'language',
        title: 'Web Development',
        description: 'Modern, responsive websites and platforms that look sharp and work smoothly across devices.',
        tags: ['Responsive', 'Performance', 'Modern UI'],
    },
    {
        icon: 'devices',
        title: 'UI Implementation',
        description: 'Clean frontend experiences translated from ideas or designs into polished user-facing products.',
        tags: ['React', 'UX Detail', 'Components'],
    },
    {
        icon: 'deployed_code',
        title: 'Custom Solutions',
        description: 'Tailored software features that solve real workflow, business, or operational problems.',
        tags: ['Product Thinking', 'Problem Solving', 'Delivery'],
    },
    {
        icon: 'hub',
        title: 'System Integration',
        description: 'Connecting tools, data, and interfaces so products feel consistent and efficient end to end.',
        tags: ['APIs', 'Data Flow', 'Scalability'],
    },
    {
        icon: 'neurology',
        title: 'AI / ML Solutions',
        description: 'Practical AI-powered features such as smart analysis, automation, and candidate-focused tooling for modern products.',
        tags: ['AI Features', 'Automation', 'ML Thinking'],
    },
];

const getCardsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
};

const Services = () => {
    const [cardsPerView, setCardsPerView] = useState(getCardsPerView);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const nextCardsPerView = getCardsPerView();
            setCardsPerView(nextCardsPerView);
            setCurrentIndex((current) => Math.min(current, Math.max(services.length - nextCardsPerView, 0)));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isPaused) return undefined;

        const maxIndex = Math.max(services.length - cardsPerView, 0);
        const interval = window.setInterval(() => {
            setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));
        }, 3200);

        return () => window.clearInterval(interval);
    }, [cardsPerView, isPaused]);

    const maxIndex = Math.max(services.length - cardsPerView, 0);
    const goPrevious = () => setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
    const goNext = () => setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));

    return (
        <section id="service" className="portfolio-section services-section">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">Services</span>
                    <h2 className="section-title display-title">What I can help a team build</h2>
                    <p className="section-intro">
                        I focus on useful software, thoughtful interfaces, and dependable implementation that supports real business goals.
                    </p>
                </div>

                <div
                    className="services-carousel-shell"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button type="button" className="services-carousel-arrow services-carousel-arrow-left" onClick={goPrevious} aria-label="Previous service">
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <div className="services-carousel-window">
                        <div
                            className="services-showcase services-carousel-track"
                            style={{ transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)` }}
                        >
                            {services.map((service, index) => (
                                <div className="service-slide" key={service.title} style={{ width: `${100 / cardsPerView}%` }}>
                                    <article className="service-card service-card-scroll is-visible">
                                        <div className="service-card-glow"></div>
                                        <div className="service-card-topline"></div>
                                        <div className="service-icon-wrap">
                                            <span className="icon material-symbols-outlined service-icon">{service.icon}</span>
                                        </div>
                                        <span className="service-count">0{index + 1}</span>
                                        <h3>{service.title}</h3>
                                        <p>{service.description}</p>
                                        <div className="service-tag-row">
                                            {service.tags.map((tag) => (
                                                <span className="service-tag" key={tag}>{tag}</span>
                                            ))}
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="button" className="services-carousel-arrow services-carousel-arrow-right" onClick={goNext} aria-label="Next service">
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="services-carousel-dots">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            className={`services-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to service set ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
