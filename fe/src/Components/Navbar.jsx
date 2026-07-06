import { useState } from 'react';
import logo from '../assets/images/ninja.png';
import { Link as ScrollLink } from 'react-scroll';

const navItems = [
    { label: 'About', target: 'about' },
    { label: 'Services', target: 'service' },
    { label: 'AI Tools', target: 'ai-tools' },
    { label: 'Projects', target: 'achievement' },
    { label: 'Experience', target: 'experience' },
    { label: 'Certificates', target: 'certificates' },
    { label: 'Contact', target: 'contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeNavbar = () => setIsOpen(false);
    const toggleNavbar = () => setIsOpen((current) => !current);

    return (
        <nav className="navbar navbar-expand-lg fixed-top portfolio-navbar">
            <div className="container portfolio-navbar-inner">
                <ScrollLink
                    to="home"
                    smooth={true}
                    duration={500}
                    className="navbar-brand portfolio-brand"
                    onClick={closeNavbar}
                >
                    <img className="logoNav" src={logo} alt="Kabano Festo logo" />
                    <span>Festo.dev</span>
                </ScrollLink>

                <button
                    className={`navbar-toggler portfolio-toggler ${isOpen ? '' : 'collapsed'}`}
                    type="button"
                    onClick={toggleNavbar}
                    aria-label="Toggle navigation"
                    aria-expanded={isOpen}
                >
                    <span className="portfolio-toggler-box" aria-hidden="true">
                        <span className="portfolio-toggler-line"></span>
                        <span className="portfolio-toggler-line"></span>
                        <span className="portfolio-toggler-line"></span>
                    </span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center portfolio-nav-list">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.target}>
                                <ScrollLink
                                    to={item.target}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-95}
                                    activeClass="active"
                                    className="nav-link portfolio-nav-link"
                                    onClick={closeNavbar}
                                >
                                    {item.label}
                                </ScrollLink>
                            </li>
                        ))}
                        <li className="nav-item">
                            <div className="nav-pill-group">
                                <a href="/resume.pdf" download="Kabano-Festo-Resume" className="nav-btn nav-btn-resume">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 2h6l3 3v9H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                                        <path d="M9 2v4h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                        <path d="M6 10l2 2 2-2M8 12V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Resume
                                </a>
                                <div className="nav-divider" />
                                <a href="/login" className="nav-btn nav-btn-connect">
                                    Let&apos;s Connect
                                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
