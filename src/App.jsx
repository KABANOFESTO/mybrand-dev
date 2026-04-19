import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Navbar from './Components/Navbar';
import OwnerLayout from './pages/owner/layout';
import OwnerOverview from './pages/owner/dashboard';
import OwnerProjectsPage from './pages/owner/projects';
import OwnerCertificatesPage from './pages/owner/certificates';
import OwnerInsightsPage from './pages/owner/insights';
import OwnerEarningsPage from './pages/owner/earnings';
import OwnerProfilePage from './pages/owner/profile';

const MAINTENANCE_MODE = false;

function MaintenancePage() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f4f8',
                fontFamily: 'sans-serif',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '48px 40px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    maxWidth: '480px',
                    width: '100%',
                }}
            >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>??</div>
                <h1 style={{ fontSize: '28px', color: '#1a202c', marginBottom: '12px' }}>Under Maintenance</h1>
                <p style={{ color: '#718096', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                    I am currently performing scheduled maintenance to improve the features. I will be back shortly.
                </p>
                <div
                    style={{
                        backgroundColor: '#ebf8ff',
                        border: '1px solid #bee3f8',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        color: '#2b6cb0',
                        fontSize: '14px',
                    }}
                >
                    Expected downtime: a few hours
                </div>
            </div>
        </div>
    );
}

const NO_LAYOUT_ROUTES = ['/login', '/signup'];

function Layout({ children }) {
    const location = useLocation();
    const hideLayout =
        NO_LAYOUT_ROUTES.includes(location.pathname) ||
        location.pathname.startsWith('/owner') ||
        location.pathname.startsWith('/vistor');

    return (
        <div className="App">
            {!hideLayout && <Navbar />}
            <div className="content">
                {children}
            </div>
            {!hideLayout && <Footer />}
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

function App() {
    if (MAINTENANCE_MODE) {
        return <MaintenancePage />;
    }

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/owner" element={<OwnerLayout />}>
                        <Route path="overview" element={<OwnerOverview />} />
                        <Route path="projects" element={<OwnerProjectsPage />} />
                        <Route path="certificates" element={<OwnerCertificatesPage />} />
                        <Route path="insights" element={<OwnerInsightsPage />} />
                        <Route path="earnings" element={<OwnerEarningsPage />} />
                        <Route path="profile" element={<OwnerProfilePage />} />
                    </Route>
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
