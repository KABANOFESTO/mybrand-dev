import { useState } from 'react';
import PropTypes from 'prop-types';
import festo from '../../assets/images/festo.jfif';

const notifications = [
    '2 recruiter profile views in the last 24 hours.',
    'One certificate needs a freshness update.',
    'A pending payment is due this week.',
];

const OwnerNavbar = ({ activeItem, onMenuToggle, sidebarOpen }) => {
    const [mobilePanel, setMobilePanel] = useState('');

    const togglePanel = (panel) => {
        setMobilePanel((current) => (current === panel ? '' : panel));
    };

    return (
        <header className="owner-topbar owner-topbar-simple owner-topbar-unified">
            <div className="owner-topbar-main owner-topbar-main-unified">
                <div className="owner-topbar-heading owner-topbar-heading-unified">
                    <button
                        type="button"
                        className={`owner-menu-toggle ${sidebarOpen ? 'is-active' : ''}`}
                        onClick={onMenuToggle}
                        aria-label="Toggle owner menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div className="owner-topbar-title">
                        <p className="owner-topbar-label">Owner dashboard</p>
                        <h2>{activeItem.title || activeItem.label}</h2>
                    </div>
                </div>

                <div className="owner-topbar-tools owner-topbar-tools-desktop">
                    <label className="owner-searchbar" aria-label="Search dashboard">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder="Search projects, certificates, payments..." />
                    </label>

                    <button type="button" className="owner-icon-button owner-notification-button" aria-label="Notifications">
                        <i className="bi bi-bell"></i>
                        <span className="owner-notification-count">3</span>
                    </button>

                    <div className="owner-profile-chip">
                        <img src={festo} alt="Kabano Festo" className="owner-profile-image" />
                        <div className="owner-profile-meta">
                            <strong>Kabano Festo</strong>
                            <span>Owner</span>
                        </div>
                    </div>
                </div>

                <div className="owner-topbar-tools owner-topbar-tools-mobile">
                    <button
                        type="button"
                        className={`owner-icon-button ${mobilePanel === 'search' ? 'is-active' : ''}`}
                        aria-label="Open search"
                        onClick={() => togglePanel('search')}
                    >
                        <i className="bi bi-search"></i>
                    </button>

                    <button
                        type="button"
                        className={`owner-icon-button owner-notification-button ${mobilePanel === 'notifications' ? 'is-active' : ''}`}
                        aria-label="Open notifications"
                        onClick={() => togglePanel('notifications')}
                    >
                        <i className="bi bi-bell"></i>
                        <span className="owner-notification-count">3</span>
                    </button>

                    <button type="button" className="owner-profile-chip owner-profile-chip-mobile" aria-label="Owner profile">
                        <img src={festo} alt="Kabano Festo" className="owner-profile-image" />
                    </button>
                </div>
            </div>

            <div className={`owner-mobile-panel ${mobilePanel ? 'is-open' : ''}`}>
                {mobilePanel === 'search' && (
                    <label className="owner-searchbar owner-searchbar-mobile" aria-label="Search dashboard">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder="Search projects, certificates, payments..." autoFocus />
                    </label>
                )}

                {mobilePanel === 'notifications' && (
                    <div className="owner-notification-panel">
                        <div className="owner-card-heading">
                            <h4>Notifications</h4>
                            <span>3 new updates</span>
                        </div>
                        <div className="owner-simple-list">
                            {notifications.map((item) => (
                                <div key={item} className="owner-simple-list-item">
                                    <span className="owner-activity-dot"></span>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

OwnerNavbar.propTypes = {
    activeItem: PropTypes.shape({
        description: PropTypes.string,
        label: PropTypes.string.isRequired,
        title: PropTypes.string,
    }).isRequired,
    onMenuToggle: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
};

export default OwnerNavbar;
