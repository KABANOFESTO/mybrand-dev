const projects = [
    { name: 'Smart Hiring Assistant', stack: 'React, Node.js, OpenAI', status: 'In Review' },
    { name: 'Hotel Booking Platform', stack: 'React, Express, MongoDB', status: 'Live' },
    { name: 'Portfolio Redesign', stack: 'React, Bootstrap, Vite', status: 'Draft' },
];

const OwnerProjectsPage = () => {
    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">Manage Projects</p>
                    <h3>Project management</h3>
                    <span>Keep your featured work organized, current, and easy to review.</span>
                </div>
            </section>

            <section className="owner-simple-panel">
                <div className="owner-card-heading">
                    <h4>Project list</h4>
                    <span>3 projects available</span>
                </div>
                <div className="owner-table-list">
                    {projects.map((project) => (
                        <div key={project.name} className="owner-table-row">
                            <div>
                                <strong>{project.name}</strong>
                                <span>{project.stack}</span>
                            </div>
                            <span className="owner-status-tag owner-status-tag-neutral">{project.status}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default OwnerProjectsPage;
