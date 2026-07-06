const OwnerProfilePage = () => {
    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">Profile Settings</p>
                    <h3>Profile details</h3>
                    <span>Update the main information recruiters and clients will trust first.</span>
                </div>
            </section>

            <section className="owner-simple-panel">
                <div className="owner-card-heading">
                    <h4>Edit profile</h4>
                    <span>Basic account information</span>
                </div>
                <div className="owner-settings-grid owner-settings-grid-simple">
                    <label>
                        <span>Full name</span>
                        <input type="text" defaultValue="Kabano Festo" />
                    </label>
                    <label>
                        <span>Email</span>
                        <input type="email" defaultValue="kabano.dev@example.com" />
                    </label>
                    <label>
                        <span>Professional title</span>
                        <input type="text" defaultValue="Software Engineer | Full-Stack & AI Builder" />
                    </label>
                    <label>
                        <span>Phone</span>
                        <input type="text" defaultValue="+250 785 206 973" />
                    </label>
                    <label className="owner-settings-full">
                        <span>Short bio</span>
                        <textarea rows="5" defaultValue="I build modern digital products with practical frontend, backend, and AI capabilities for real-world business use."></textarea>
                    </label>
                </div>
            </section>
        </div>
    );
};

export default OwnerProfilePage;
