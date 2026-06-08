const insights = [
    {
        title: 'Best recruiter signal',
        text: 'Projects that mix AI and real business outcomes attract more attention.'
    },
    {
        title: 'Main gap',
        text: 'Some projects still need metrics like time saved, users helped, or performance improvements.'
    },
    {
        title: 'Recommended step',
        text: 'Turn one strong project into a deeper case study with clear problem, solution, and results.'
    },
];

const OwnerInsightsPage = () => {
    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">AI Insights</p>
                    <h3>Practical recommendations</h3>
                    <span>Use these suggestions to strengthen the portfolio without adding noise.</span>
                </div>
            </section>

            <section className="owner-simple-grid owner-simple-grid-three">
                {insights.map((item) => (
                    <article key={item.title} className="owner-simple-card">
                        <p>{item.title}</p>
                        <strong>{item.text}</strong>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default OwnerInsightsPage;
