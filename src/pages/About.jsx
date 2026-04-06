import me from '../assets/images/festo.jfif';

const strengths = [
    'Full-stack mindset with strong frontend execution',
    'Clean, responsive interfaces that feel production-ready',
    'Collaborative delivery with debugging and QA discipline',
];

const About = () => {
    return (
        <section id="about" className="portfolio-section about-section">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">About Me</span>
                    <h2 className="section-title display-title">Developer with product taste and delivery focus</h2>
                    <p className="section-intro">
                        I build digital experiences that balance visual quality, usability, and dependable code so products
                        feel polished from the first impression to the last interaction.
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
                            I am a software developer who enjoys turning concepts into practical, high-quality products. My
                            experience covers planning, interface design, implementation, testing, and continuous improvement,
                            which helps me contribute across the full delivery cycle.
                        </p>
                        <p>
                            My background includes hands-on learning in web development, backend fundamentals, and project
                            execution with tools such as JavaScript, Python, Django, Git, and modern UI workflows. I care
                            about building software that feels intuitive for users and reliable for teams.
                        </p>

                        <div className="about-strengths">
                            {strengths.map((strength) => (
                                <div className="about-strength-card" key={strength}>
                                    <i className="bi bi-stars"></i>
                                    <span>{strength}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
