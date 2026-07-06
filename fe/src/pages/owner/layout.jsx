import { useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import OwnerNavbar from '../../Components/owner/Navbar';
import OwnerSidebar from '../../Components/owner/Sidebar';

export const ownerMenu = [
    {
        id: 'overview',
        path: '/owner/overview',
        label: 'Overview',
        title: 'Overview',
        description: 'Quick summary of performance, activity, and portfolio health.',
        icon: 'bi-grid-1x2-fill',
        actionLabel: 'View Report',
    },
    {
        id: 'projects',
        path: '/owner/projects',
        label: 'Projects',
        title: 'Manage Projects',
        description: 'Organize projects, delivery status, and live portfolio visibility.',
        icon: 'bi-kanban-fill',
        actionLabel: 'Add Project',
    },
    {
        id: 'certificates',
        path: '/owner/certificates',
        label: 'Certificates',
        title: 'Manage Certificates',
        description: 'Keep certificates updated and ready for recruiter review.',
        icon: 'bi-patch-check-fill',
        actionLabel: 'Upload Certificate',
    },
    {
        id: 'insights',
        path: '/owner/insights',
        label: 'AI Insights',
        title: 'AI Insights',
        description: 'See practical AI recommendations for portfolio improvement.',
        icon: 'bi-stars',
        actionLabel: 'Run Analysis',
    },
    {
        id: 'earnings',
        path: '/owner/earnings',
        label: 'Earnings',
        title: 'My-Earning (Payments)',
        description: 'Track revenue, invoices, and payment status clearly.',
        icon: 'bi-wallet2',
        actionLabel: 'Export Payments',
    },
    {
        id: 'profile',
        path: '/owner/profile',
        label: 'Profile',
        title: 'Profile Settings',
        description: 'Update your public owner information and account details.',
        icon: 'bi-person-gear',
        actionLabel: 'Save Profile',
    },
];

const OwnerLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeItem = useMemo(() => {
        return ownerMenu.find((item) => location.pathname.startsWith(item.path)) || ownerMenu[0];
    }, [location.pathname]);

    if (location.pathname === '/owner' || location.pathname === '/owner/') {
        return <Navigate to="/owner/overview" replace />;
    }

    return (
        <div className="owner-dashboard-shell owner-dashboard-shell-simple">
            <OwnerSidebar
                items={ownerMenu}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="owner-dashboard-main">
                <OwnerNavbar
                    activeItem={activeItem}
                    sidebarOpen={sidebarOpen}
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="owner-dashboard-content">
                    <Outlet context={{ activeItem, closeSidebar: () => setSidebarOpen(false) }} />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
