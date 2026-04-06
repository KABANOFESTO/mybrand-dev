import c1 from '../assets/images/back.jpg';
import c2 from '../assets/images/javascript.jpg';
import c3 from '../assets/images/web.jpg';
import c4 from '../assets/images/wsaa.png';

const certificates = [
    {
        title: 'Back End and APIs',
        provider: 'freeCodeCamp',
        image: c1,
    },
    {
        title: 'JavaScript Algorithms',
        provider: 'freeCodeCamp',
        image: c2,
    },
    {
        title: 'Responsive Web Design',
        provider: 'freeCodeCamp',
        image: c3,
    },
    {
        title: 'MERN Stack',
        provider: 'Webstack Academy',
        image: c4,
    },
];

const Certificates = () => {
    return (
        <section className="portfolio-section certificates-section" id="certificates">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">Credentials</span>
                    <h2 className="section-title display-title">Accreditation and certification highlights</h2>
                    <p className="section-intro">
                        A focused snapshot of the certifications that support my practical development background.
                    </p>
                </div>

                <div className="certificate-grid">
                    {certificates.map((certificate) => (
                        <article className="certificate-card" key={certificate.title}>
                            <div className="certificate-image-shell">
                                <img src={certificate.image} alt={certificate.title} className="certificate-image" />
                            </div>
                            <div className="certificate-content">
                                <span>{certificate.provider}</span>
                                <h3>{certificate.title}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
