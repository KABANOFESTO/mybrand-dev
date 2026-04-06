import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';

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
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔧</div>
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

function App() {
    if (MAINTENANCE_MODE) {
        return <MaintenancePage />;
    }

    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
