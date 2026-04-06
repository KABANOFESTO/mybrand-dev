import { useState } from 'react';
import logo from '../assets/images/ninja.png';
import { Link as ScrollLink } from 'react-scroll';

const navItems = [
    { label: 'About', target: 'about' },
    { label: 'Services', target: 'service' },
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
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center portfolio-nav-list">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.target}>
                                <ScrollLink
                                    to={item.target}
                                    smooth={true}
                                    duration={500}
                                    className="nav-link portfolio-nav-link"
                                    onClick={closeNavbar}
                                >
                                    {item.label}
                                </ScrollLink>
                            </li>
                        ))}
                        <li className="nav-item">
                            <a href="/festo.pdf" download="Kabano-Festo-Resume" className="portfolio-resume-btn">
                                Resume
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
