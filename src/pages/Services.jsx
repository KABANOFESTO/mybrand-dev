import { useEffect, useRef } from 'react';

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
];

const Services = () => {
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        const currentCards = cardRefs.current.filter(Boolean);
        currentCards.forEach((card) => observer.observe(card));

        return () => {
            currentCards.forEach((card) => observer.unobserve(card));
            observer.disconnect();
        };
    }, []);

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

                <div className="services-showcase">
                    {services.map((service, index) => (
                        <article
                            className="service-card service-card-scroll"
                            key={service.title}
                            ref={(element) => {
                                cardRefs.current[index] = element;
                            }}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
