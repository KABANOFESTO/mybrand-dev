import me from '../assets/images/festo.jfif';

const About = () => {
    return (
        <section id="about" className="portfolio-section about-section">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">About Me</span>
                    <h2 className="section-title display-title">Developer Who Builds and Ships Quality Products</h2>
                    <p className="section-intro">
                        Full-stack developer and AI/ML engineer who turns ideas into production .
                    </p>
                </div>

                <div className="about-grid">
                    <div className="about-portrait-shell">
                        <div className="about-portrait-card">
                            <div className="about-portrait-glow"></div>
                            <img src={me} alt="Kabano Festo" className="about-portrait" />
                        </div>
                    </div>

                    <div className="about-panel">
                        <p>
                            I’m a full-stack developer and AI/ML engineer who builds and ships real-world products. I take ideas from concept to production, focusing on systems that are reliable, scalable, and easy to use.
                        </p>
                        <p>
                            I work mainly with JavaScript, Python, and Django, with strong backend and machine learning experience. I care about clean code, intuitive design, and delivering products that are truly ready for users.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
