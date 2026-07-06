import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const OwnerSidebar = ({ items, isOpen, onClose }) => {
    return (
        <>
            <button
                type="button"
                className={`owner-sidebar-backdrop ${isOpen ? 'is-visible' : ''}`}
                aria-label="Close sidebar"
                onClick={onClose}
            />

            <aside className={`owner-sidebar ${isOpen ? 'is-open' : ''}`}>
                <div className="owner-sidebar-body">
                    <div className="owner-sidebar-top">
                        <div className="owner-brand-mark">FD</div>
                        <div>
                            <p className="owner-brand-eyebrow">Owner Panel</p>
                            <h1 className="owner-brand-name">Festo.dev</h1>
                        </div>
                    </div>

                    <nav className="owner-sidebar-nav owner-sidebar-nav-simple" aria-label="Owner navigation">
                        {items.map((item) => (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) => `owner-nav-item owner-nav-item-simple ${isActive ? 'is-active' : ''}`}
                            >
                                <span className="owner-nav-icon">
                                    <i className={`bi ${item.icon}`}></i>
                                </span>
                                <span className="owner-nav-label">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="owner-sidebar-footer">
                    <button type="button" className="owner-logout-button">
                        <span className="owner-nav-icon">
                            <i className="bi bi-box-arrow-right"></i>
                        </span>
                        <span className="owner-nav-label">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

OwnerSidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default OwnerSidebar;
