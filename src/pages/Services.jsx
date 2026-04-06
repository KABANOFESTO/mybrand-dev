const services = [
    {
        icon: 'language',
        title: 'Web Development',
        description: 'Modern, responsive websites and platforms that look sharp and work smoothly across devices.',
    },
    {
        icon: 'devices',
        title: 'UI Implementation',
        description: 'Clean frontend experiences translated from ideas or designs into polished user-facing products.',
    },
    {
        icon: 'deployed_code',
        title: 'Custom Solutions',
        description: 'Tailored software features that solve real workflow, business, or operational problems.',
    },
    {
        icon: 'hub',
        title: 'System Integration',
        description: 'Connecting tools, data, and interfaces so products feel consistent and efficient end to end.',
    },
];

const Services = () => {
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
                    {services.map((service) => (
                        <article className="service-card" key={service.title}>
                            <div className="service-icon-wrap">
                                <span className="icon material-symbols-outlined service-icon">{service.icon}</span>
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
