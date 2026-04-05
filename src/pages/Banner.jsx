
import { useEffect, useRef } from 'react';
import festo from '../assets/images/f.jpg';
import $ from 'jquery';
import '../tools/Typerwriter';
import { Link } from 'react-router-dom';
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
                cursor: "✍",
                selectedBackground: "#F1F1F1",
                selectedText: "#333333",
                actions: [
                    { type: '“Coding is My Passion!!!”' },
                    { delay: 1000 },
                    { remove: { num: 25, type: '' } },
                    { type: 'Make it Work! Make it Right!' },
                    { delay: 1000 },
                    { remove: { num: 28, type: '' } },
                    { type: '“Coding is My Passion!!!”' },
                ],
            });
        }
        if (type) {
            $(type).typewrite({
                speed: 8,
                blinkSpeed: 2,
                showCursor: true,
                blinkingCursor: true,
                cursor: "|",
                selectedBackground: "#F1F1F1",
                selectedText: "#333333",
                actions: [
                    { type: '....' },
                    { delay: 1000 },
                    { remove: { num: 4, type: '' } },
                    { type: '....' },
                    { delay: 1000 },
                    { remove: { num: 4, type: '' } },
                    { type: '....' },
                ],
            });
        }
    }, []);
    return (
        <>
            <section className="w-full py-5 min-h-full body-section " id='home' >
                <div className="container d-flex justify-content-center align-items-center  homeBody">
                    <div className="row align-items-center ">
                        <div className="col-md-6">
                            <div className="card mx-auto">
                                <div className="card-body text-start" style={{ alignItems: 'center'}}>
                                    <h1 className="card-title">Hey! My name is</h1>
                                    <h4 className='text-success'>KABANO  Festo</h4>
                                    <p className="card-text">A results-driven software developer with a fervor for creating robust and innovative solutions.  My journey in the realm of coding started when i was in High school, Where
                                        i got first test of Coding.</p>
                                    <div className="button-container">

                                        <Link style={{ textDecoration: 'none' }}>
                                            <ScrollLink
                                                to="contact"
                                                smooth={true}
                                                duration={500}
                                            >
                                                <button
                                                    className="btn shadow-md btn-success mt-4 d-flex"
                                                    style={{ height: '40px' }}
                                                >
                                                    Connect With Me
                                                    <p id="typewriteText" ref={typewriteTextRe} style={{ margin: 0 }}>
                                                        ...😎
                                                    </p>
                                                </button>
                                            </ScrollLink>
                                        </Link>
                                    </div>
                                    <div className="social-media mt-4">
                                        <a className="social-item" href="https://www.facebook.com/kabano.festo"><i className="bi bi-facebook"></i></a>
                                        <a className="social-item" href="https://www.linkedin.com/in/festo-kabano-3b5150251/"><i className="bi bi-linkedin"></i></a>
                                        <a className="social-item" href="https://github.com/KABANOFESTO"><i className="bi bi-github"></i></a>
                                        <a className="social-item" href="https://www.instagram.com/kbb.32/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            <img
                                className="img-body"
                                src={festo}
                                alt="KABANO U. Festo"
                            />
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="copyRight text-center">
                        <p id="typewriteText" ref={typewriteTextRef}></p>
                        <p>“Means with coding, I can do whatever you want: Just DM me”</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Banner;