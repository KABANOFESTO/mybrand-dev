import { useEffect, useRef, useState } from 'react';
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

const getCardsPerView = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1200) return 2;
    return 3;
};

const Certificates = () => {
    const [cardsPerView, setCardsPerView] = useState(getCardsPerView);
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            const nextCardsPerView = getCardsPerView();
            setCardsPerView(nextCardsPerView);
            setCurrentIndex((current) => Math.min(current, Math.max(certificates.length - nextCardsPerView, 0)));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(certificates.length - cardsPerView, 0);
    const goPrevious = () => setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
    const goNext = () => setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));

    const handleTouchStart = (event) => {
        touchStartX.current = event.changedTouches[0].clientX;
    };

    const handleTouchMove = (event) => {
        touchEndX.current = event.changedTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartX.current - touchEndX.current;
        const swipeThreshold = 50;

        if (swipeDistance > swipeThreshold) {
            goNext();
        } else if (swipeDistance < -swipeThreshold) {
            goPrevious();
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };

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

                <div className="certificates-carousel-shell">
                    <button type="button" className="certificates-carousel-arrow" onClick={goPrevious} aria-label="Previous certificate">
                        <i className="bi bi-arrow-left"></i>
                    </button>

                    <div className="certificates-carousel-window" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                        <div
                            className="certificate-grid certificates-carousel-track"
                            style={{ transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)` }}
                        >
                            {certificates.map((certificate) => (
                                <div className="certificate-slide" key={certificate.title} style={{ width: `${100 / cardsPerView}%` }}>
                                    <article className="certificate-card certificate-card-scroll">
                                        <div className="certificate-image-shell">
                                            <img src={certificate.image} alt={certificate.title} className="certificate-image" />
                                        </div>
                                        <div className="certificate-content">
                                            <span>{certificate.provider}</span>
                                            <h3>{certificate.title}</h3>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="button" className="certificates-carousel-arrow" onClick={goNext} aria-label="Next certificate">
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="certificates-carousel-dots">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            className={`certificates-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to certificate set ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
