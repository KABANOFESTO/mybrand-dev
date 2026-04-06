const contactItems = [
    { icon: 'bi-geo-alt', label: 'Location', value: 'Kigali, Rwanda' },
    { icon: 'bi-telephone', label: 'Phone', value: '+250 785 206 973' },
    { icon: 'bi-envelope', label: 'Email', value: 'kabanofesto1@gmail.com' },
    { icon: 'bi-globe', label: 'Website', value: 'festokabano.vercel.app' },
];

const Contact = () => {
    return (
        <section className="portfolio-section contact-section" id="contact">
            <div className="container">
                <div className="section-heading">
                    <span className="section-eyebrow">Contact</span>
                    <h2 className="section-title display-title">Let&apos;s exchange ideas and build something valuable</h2>
                    <p className="section-intro">
                        I&apos;m open to internships,developer roles, freelance projects, and collaborative opportunities.
                    </p>
                </div>

                <div className="contact-grid">
                    <div className="contact-panel">
                        <h3>Start the conversation</h3>
                        <form className="contact-form">
                            <input type="text" placeholder="Your name" aria-label="Your name" />
                            <input type="email" placeholder="Your email" aria-label="Your email" />
                            <input type="text" placeholder="Role or company" aria-label="Role or company" />
                            <textarea rows="5" placeholder="Tell me about your project or opportunity" aria-label="Message"></textarea>
                            <button type="button" className="hero-primary-btn contact-submit-btn">Send Message</button>
                        </form>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-map-card">
                            <iframe
                                className="contact-map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4663352849548!2d30.15703781058143!3d-1.967431798006474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19db599d29c5b3d1%3A0xdce613598e7fcf02!2sKanombe!5e0!3m2!1sen!2srw!4v1718228847584!5m2!1sen!2srw"
                                title="Kanombe Kigali Rwanda"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <div className="contact-info-list">
                            {contactItems.map((item) => (
                                <div className="contact-info-item" key={item.label}>
                                    <i className={`bi ${item.icon}`}></i>
                                    <div>
                                        <span>{item.label}</span>
                                        <strong>{item.value}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
