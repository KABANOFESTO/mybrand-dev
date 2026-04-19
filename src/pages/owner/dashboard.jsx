const statCards = [
    { label: 'Portfolio Views', value: '18.4K', note: '+12% this month' },
    { label: 'Recruiter Messages', value: '126', note: '8 new this week' },
    { label: 'Active Projects', value: '9', note: '3 highlighted' },
    { label: 'Certificates', value: '14', note: '2 need update' },
];

const recentItems = [
    'Updated project showcase for better recruiter visibility.',
    'Added new AI tool card and refreshed mobile layout.',
    'Uploaded one new certificate to strengthen proof of skill.',
    'Received two new recruiter visits from portfolio traffic.',
];

const OverviewPage = () => {
    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">Overview</p>
                    <h3>Welcome back, Festo</h3>
                    <span>Here is a quick summary of your portfolio activity and current progress.</span>
                </div>
                <div className="owner-section-chip">Last updated today</div>
            </section>

            <section className="owner-simple-grid owner-simple-grid-four">
                {statCards.map((item) => (
                    <article key={item.label} className="owner-simple-card">
                        <p>{item.label}</p>
                        <strong>{item.value}</strong>
                        <span>{item.note}</span>
                    </article>
                ))}
            </section>

            <section className="owner-simple-grid owner-simple-grid-two">
                <article className="owner-simple-panel">
                    <div className="owner-card-heading">
                        <h4>Recent activity</h4>
                        <span>Latest changes</span>
                    </div>
                    <div className="owner-simple-list">
                        {recentItems.map((item) => (
                            <div key={item} className="owner-simple-list-item">
                                <span className="owner-activity-dot"></span>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="owner-simple-panel">
                    <div className="owner-card-heading">
                        <h4>Quick focus</h4>
                        <span>What deserves attention</span>
                    </div>
                    <div className="owner-quick-note">
                        <strong>Add measurable project results</strong>
                        <p>Recruiters respond better when projects include impact numbers like performance gains, users served, or automation saved.</p>
                    </div>
                    <div className="owner-quick-note">
                        <strong>Refresh old certificates</strong>
                        <p>Keeping proof updated makes the portfolio feel active and trusted.</p>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default OverviewPage;
