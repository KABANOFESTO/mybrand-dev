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
        group: 'portfolio',
        title: 'Manage Projects',
        description: 'Organize projects, delivery status, and live portfolio visibility.',
        icon: 'bi-kanban-fill',
        actionLabel: 'Add Project',
    },
    {
        id: 'certificates',
        path: '/owner/certificates',
        label: 'Certificates',
        group: 'portfolio',
        title: 'Manage Certificates',
        description: 'Keep certificates updated and ready for recruiter review.',
        icon: 'bi-patch-check-fill',
        actionLabel: 'Upload Certificate',
    },
    {
        id: 'skills',
        path: '/owner/skills',
        label: 'Skills',
        group: 'portfolio',
        title: 'Skills',
        description: 'Maintain the skills and technologies shown across your portfolio.',
        icon: 'bi-lightning-charge-fill',
        actionLabel: 'Add Skill',
    },
    {
        id: 'experience',
        path: '/owner/experience',
        label: 'Experience',
        group: 'portfolio',
        title: 'Experience',
        description: 'Present the roles and outcomes that demonstrate your impact.',
        icon: 'bi-briefcase-fill',
        actionLabel: 'Add Experience',
    },
    {
        id: 'education',
        path: '/owner/education',
        label: 'Education',
        group: 'portfolio',
        title: 'Education',
        description: 'Keep your education history accurate and easy to review.',
        icon: 'bi-mortarboard-fill',
        actionLabel: 'Add Education',
    },
    {
        id: 'usage',
        path: '/owner/usage',
        label: 'Usage',
        group: 'ai',
        title: 'AI Usage',
        description: 'Monitor AI feature usage and manage your workspace allowance.',
        icon: 'bi-cpu-fill',
        actionLabel: 'View Usage',
    },
    {
        id: 'insights',
        path: '/owner/insights',
        label: 'AI Insights',
        group: 'ai',
        title: 'AI Insights',
        description: 'See practical AI recommendations for portfolio improvement.',
        icon: 'bi-stars',
        actionLabel: 'Run Analysis',
    },
    {
        id: 'users',
        path: '/owner/users',
        label: 'Users',
        title: 'Users',
        description: 'Manage access and keep track of people using your portfolio platform.',
        icon: 'bi-people-fill',
        actionLabel: 'Manage Users',
    },
    {
        id: 'earnings',
        path: '/owner/earnings',
        label: 'Payments',
        title: 'Payments',
        description: 'Track revenue, invoices, and payment status clearly.',
        icon: 'bi-wallet2',
        actionLabel: 'Export Payments',
    },
    {
        id: 'analytics',
        path: '/owner/analytics',
        label: 'Analytics',
        title: 'Analytics',
        description: 'Understand portfolio visits, engagement, and conversion trends.',
        icon: 'bi-bar-chart-fill',
        actionLabel: 'View Report',
    },
    {
        id: 'inbox',
        path: '/owner/inbox',
        label: 'Inbox',
        title: 'Inbox',
        description: 'Stay on top of recruiter messages and new collaboration requests.',
        icon: 'bi-inbox-fill',
        actionLabel: 'Open Inbox',
    },
    {
        id: 'alerts',
        path: '/owner/alerts',
        label: 'Alerts',
        title: 'Alerts',
        description: 'Review important account, portfolio, and payment notifications.',
        icon: 'bi-bell-fill',
        actionLabel: 'Review Alerts',
    },
    {
        id: 'profile',
        path: '/owner/profile',
        label: 'Settings',
        title: 'Settings',
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
        <div className="flex min-h-screen bg-[#10121a]">
            <OwnerSidebar items={ownerMenu} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <OwnerNavbar
                    activeItem={activeItem}
                    sidebarOpen={sidebarOpen}
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="flex-1 overflow-y-auto px-4 pb-4 pt-3 text-[#e7e9f2] sm:px-6 sm:pb-6 sm:pt-4 lg:px-8 lg:pt-5">
                    <Outlet context={{ activeItem, closeSidebar: () => setSidebarOpen(false) }} />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
