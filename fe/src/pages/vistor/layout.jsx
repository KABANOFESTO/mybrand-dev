import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import VisitorNavbar from '../../Components/vistor/Navbar';
import VisitorSidebar from '../../Components/vistor/Sidebar';

const visitorMenu = [
	{
		id: 'overview',
		path: '/vistor/overview',
		label: 'Overview',
		title: 'Portfolio overview',
		icon: 'bi-grid-1x2-fill',
	},
	{
		id: 'profile',
		path: '/vistor/profile',
		label: 'My profile',
		title: 'Edit public profile',
		icon: 'bi-person-badge',
	},
	{
		id: 'projects',
		path: '/vistor/projects',
		label: 'Projects',
		title: 'Manage projects',
		icon: 'bi-kanban-fill',
	},
	{
		id: 'certificates',
		path: '/vistor/certificates',
		label: 'Certificates',
		title: 'Manage certificates',
		icon: 'bi-patch-check-fill',
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
