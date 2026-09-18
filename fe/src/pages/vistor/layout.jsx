import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import VisitorNavbar from '../../Components/vistor/Navbar';
import VisitorSidebar from '../../Components/vistor/Sidebar';

const visitorMenu = [
	{
		id: 'home',
		path: '/vistor/home',
		label: 'Home',
		title: 'Dashboard Home',
		icon: 'bi-house-door-fill',
	},
	{
		id: 'code-review',
		path: '/vistor/code-review',
		label: 'Code Review',
		title: 'AI Code Review',
		icon: 'bi-code-square',
	},
	{
		id: 'skills',
		path: '/vistor/skills',
		label: 'Skills',
		title: 'Skill Analyzer',
		icon: 'bi-lightning-charge-fill',
	},
	{
		id: 'resume',
		path: '/vistor/resume',
		label: 'Resume',
		title: 'Resume Generator',
		icon: 'bi-file-earmark-person-fill',
	},
	{
		id: 'interview',
		path: '/vistor/interview',
		label: 'Interview',
		title: 'Interview Simulator',
		icon: 'bi-chat-square-text-fill',
	},
	{
		id: 'activity',
		path: '/vistor/activity',
		label: 'Activity',
		title: 'Activity',
		icon: 'bi-clock-history',
	},
	{
		id: 'plan',
		path: '/vistor/plan',
		label: 'Plan',
		title: 'Plan',
		icon: 'bi-stars',
	},
	{
		id: 'billing',
		path: '/vistor/billing',
		label: 'Billing',
		title: 'Billing',
		icon: 'bi-credit-card-fill',
	},
	{
		id: 'settings',
		path: '/vistor/settings',
		label: 'Settings',
		title: 'Settings',
		icon: 'bi-gear-fill',
	},
];

const VisitorLayout = () => {
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const activeItem = useMemo(
		() => visitorMenu.find((item) => location.pathname.startsWith(item.path)) || visitorMenu[0],
		[location.pathname]
	);

	return (
		<div className="flex min-h-screen bg-[#10121a]">
			<VisitorSidebar items={visitorMenu} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex min-w-0 flex-1 flex-col">
				<VisitorNavbar
					activeItem={activeItem}
					sidebarOpen={sidebarOpen}
					onMenuToggle={() => setSidebarOpen((current) => !current)}
				/>
				<main className="flex-1 overflow-y-auto px-4 pb-6 pt-3 text-[#e7e9f2] sm:px-6 sm:pt-4 lg:px-8 lg:pt-5">
					<Outlet context={{ activeItem, closeSidebar: () => setSidebarOpen(false) }} />
				</main>
			</div>
		</div>
	);
};

export default VisitorLayout;
