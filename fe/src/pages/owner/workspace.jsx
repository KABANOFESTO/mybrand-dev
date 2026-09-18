import { useOutletContext } from 'react-router-dom';

const OwnerWorkspacePage = () => {
    const { activeItem } = useOutletContext();
    const title = activeItem?.title || activeItem?.label || 'Workspace';
    const description = activeItem?.description || 'Manage this part of your workspace.';
    const action = activeItem?.actionLabel || 'Manage';

    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">Owner workspace</p>
                    <h3>{title}</h3>
                    <span>{description}</span>
                </div>
                <button type="button" className="owner-primary-button">{action}</button>
            </section>
            <section className="owner-simple-panel">
                <div className="owner-card-heading">
                    <div>
                        <h4>{title} hub</h4>
                        <p>Your workspace is ready for the next update.</p>
                    </div>
                    <span className="owner-status-tag owner-status-tag-neutral">Ready</span>
                </div>
                <div className="owner-quick-note">
                    <span className="owner-activity-dot" />
                    <p>Connect your data or start adding content to see it here.</p>
                </div>
            </section>
        </div>
    );
};

export default OwnerWorkspacePage;
