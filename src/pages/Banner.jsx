import { useEffect, useRef } from 'react';
import festo from '../assets/images/f.jpg';
import $ from 'jquery';
import '../tools/Typerwriter';
import { Link as ScrollLink } from 'react-scroll';

const Banner = () => {
    const typewriteTextRef = useRef(null);
    const typewriteTextRe = useRef(null);

    useEffect(() => {
        const typewriteText = typewriteTextRef.current;
        const type = typewriteTextRe.current;

        if (typewriteText) {
            $(typewriteText).typewrite({
                speed: 8,
                blinkSpeed: 2,
                showCursor: true,
                blinkingCursor: true,
                cursor: '|',
                selectedBackground: '#F1F1F1',
                selectedText: '#333333',
                actions: [
                    { type: 'Coding is my passion.' },
                    { delay: 1000 },
                    { remove: { num: 22, type: '' } },
                    { type: 'Building products that feel premium.' },
                    { delay: 1000 },
                    { remove: { num: 36, type: '' } },
                    { type: 'Coding is my passion.' },
                ],
            });
        }

        if (type) {
            $(type).typewrite({
                speed: 8,
                blinkSpeed: 2,
                showCursor: true,
                blinkingCursor: true,
                cursor: '|',
                selectedBackground: '#F1F1F1',
                selectedText: '#333333',
                actions: [
                    { type: '...' },
                    { delay: 1000 },
                    { remove: { num: 3, type: '' } },
                    { type: '...' },
                    { delay: 1000 },
                    { remove: { num: 3, type: '' } },
                    { type: '...' },
                ],
            });
        }
    }, []);

    return (
        <section className="hero-section body-section" id="home">
            <div className="hero-orb hero-orb-one"></div>
            <div className="hero-orb hero-orb-two"></div>

            <div className="container hero-shell">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6">
                        <div className="hero-copy">
                            <span className="hero-kicker">Hello</span>
                            <h2 className="hero-name">my name is Kabano Festo</h2>
                            <p className="hero-description">
                                A full-stack developer passionate about building intelligent, scalable, and user focused solutions
                            </p>

                            <div className="hero-chip-row">
                                <span className="hero-chip">Backend</span>
                                <span className="hero-chip">Machine Learning</span>
                                <span className="hero-chip">Frontend Craft</span>
                                <span className="hero-chip">Clean Code</span>
                            </div>

                            <div className="hero-actions">
                                <ScrollLink
                                    to="contact"
                                    smooth={true}
                                    duration={500}
                                    className="hero-primary-btn"
                                >
                                    Let&apos;s Build Together
                                    <span ref={typewriteTextRe} className="hero-btn-type">...</span>
                                </ScrollLink>
                                <a
                                    className="hero-secondary-btn"
                                    href="https://github.com/KABANOFESTO"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View GitHub
                                </a>
                            </div>

                            <div className="social-media hero-socials">
                                <a className="social-item" href="https://www.linkedin.com/in/festo-kabano-3b5150251/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                                <a className="social-item" href="https://github.com/KABANOFESTO" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="bi bi-github"></i></a>
                                <a className="social-item" href="https://www.instagram.com/kabano.festo/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                                <a className="social-item" href="https://www.facebook.com/kabano.festo" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="hero-visual-wrap">
                            <div className="hero-visual-card">
                                <div className="hero-image-glow"></div>
                                <img
                                    className="img-body hero-image"
                                    src={festo}
                                    alt="Kabano Festo portrait"
                                />
                                <div className="hero-visual-grid"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
