import PropTypes from 'prop-types';

const RecruiterNavbar = ({ activeItem, sidebarOpen, onMenuToggle }) => (
    <header className="sticky top-0 z-30 border-b border-[#262a38] bg-[#10121a]/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={onMenuToggle} aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={sidebarOpen} aria-controls="recruiter-sidebar" className="flex h-9 w-9 items-center justify-center rounded-md border border-[#302c42] bg-[#171522] text-[#a7a1bd] lg:hidden"><i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'} text-lg`} /></button><div className="min-w-0"><p className="font-mono text-[11px] text-[#6f7186]">recruiter/{activeItem?.id || 'overview'}</p><h1 className="truncate text-[15px] font-semibold text-[#f0eeff] sm:text-[17px]">{activeItem?.title || 'Recruiter workspace'}</h1></div></div>
            <div className="flex items-center gap-2"><span className="hidden rounded-full border border-[#8b7bff]/30 bg-[#8b7bff]/10 px-3 py-1.5 font-mono text-[11px] text-[#c2b9ff] sm:block">Candidate review</span><button type="button" aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#302c42] bg-[#171522] text-[#b9b2ce]"><i className="bi bi-bell" /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#10121a] bg-[#a99aff]" /></button></div>
        </div>
    </header>
);

RecruiterNavbar.propTypes = { activeItem: PropTypes.object, sidebarOpen: PropTypes.bool.isRequired, onMenuToggle: PropTypes.func.isRequired };
export default RecruiterNavbar;
