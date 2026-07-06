const certificates = [
    { name: 'Responsive Web Design', issuer: 'freeCodeCamp', year: '2025' },
    { name: 'AI for Developers', issuer: 'Coursera', year: '2026' },
    { name: 'Software Architecture Foundations', issuer: 'LinkedIn Learning', year: '2025' },
];

const OwnerCertificatesPage = () => {
    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">Manage Certificates</p>
                    <h3>Certificate library</h3>
                    <span>Manage training proof and keep it ready for recruiter trust.</span>
                </div>
            </section>

            <section className="owner-simple-grid owner-simple-grid-three">
                {certificates.map((item) => (
                    <article key={item.name} className="owner-simple-card">
                        <p>{item.issuer}</p>
                        <strong>{item.name}</strong>
                        <span>{item.year}</span>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default OwnerCertificatesPage;
