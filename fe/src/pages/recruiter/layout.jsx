import { useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import RecruiterNavbar from '../../Components/recruiter/Navbar';
import RecruiterSidebar from '../../Components/recruiter/Sidebar';

export const recruiterMenu = [
    { id: 'overview', path: '/recruiter/overview', label: 'Overview', title: 'Candidate overview', icon: 'bi-grid-1x2-fill' },
    { id: 'profile', path: '/recruiter/profile', label: 'Profile', title: 'Professional profile', icon: 'bi-person-vcard-fill' },
    { id: 'projects', path: '/recruiter/projects', label: 'Projects', title: 'Project portfolio', icon: 'bi-kanban-fill' },
    { id: 'certificates', path: '/recruiter/certificates', label: 'Certificates', title: 'Verified certificates', icon: 'bi-patch-check-fill' },
    { id: 'skills', path: '/recruiter/skills', label: 'Skills', title: 'Technical skills', icon: 'bi-lightning-charge-fill' },
    { id: 'resume', path: '/recruiter/resume', label: 'Resume', title: 'Resume', icon: 'bi-file-earmark-text-fill' },
    { id: 'contact', path: '/recruiter/contact', label: 'Contact', title: 'Contact candidate', icon: 'bi-send-fill' },
];

const RecruiterLayout = () => {
    const location = useLocation(); const [sidebarOpen, setSidebarOpen] = useState(false);
    const activeItem = useMemo(() => recruiterMenu.find((item) => location.pathname.startsWith(item.path)) || recruiterMenu[0], [location.pathname]);
    if (location.pathname === '/recruiter' || location.pathname === '/recruiter/') return <Navigate to="/recruiter/overview" replace />;
    return <div className="flex min-h-screen bg-[#10121a]"><RecruiterSidebar items={recruiterMenu} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><RecruiterNavbar activeItem={activeItem} sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen((value) => !value)} /><main className="flex-1 px-4 py-4 text-[#f0eeff] sm:px-6 lg:px-8 lg:py-5"><Outlet /></main></div></div>;
};
export default RecruiterLayout;
