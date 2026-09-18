import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';

const RecruiterSidebar = ({ items, isOpen, onClose }) => {
    const location = useLocation();
    const activeItem = items.find((item) => location.pathname.startsWith(item.path));

    return (
        <>
            <button type="button" aria-label="Close sidebar" onClick={onClose} className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} />
            <aside id="recruiter-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[280px] flex-col border-r border-[#262a38] bg-[#10121a] font-sans transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:sticky lg:top-0 lg:h-screen lg:w-[272px] lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="border-b border-white/[0.06] px-5 pb-4 pt-6">
                    <div className="flex items-center gap-3"><span className="rounded-md border border-[#3a3351] bg-[#1b1828] px-2 py-1.5 font-mono text-[15px] font-semibold text-[#b9a7ff]">&lt;R/&gt;</span><p className="font-mono text-[11px] text-[#6f7186]">{'// recruiter-space'}</p></div>
                    <div className="mt-3.5 inline-flex items-center gap-2 rounded-md border border-[#302c42] bg-[#171522] px-2.5 py-1.5 font-mono text-[11.5px] text-[#a7a1bd]"><span className="h-1.5 w-1.5 rounded-full bg-[#8b7bff] shadow-[0_0_0_3px_rgba(139,123,255,0.15)]" />{activeItem?.id || 'overview'}.view</div>
                </div>
                <nav aria-label="Recruiter navigation" className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3.5">
                    <p className="mb-1.5 flex items-center gap-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f7186]"><i className="bi bi-person-workspace text-[#a99aff]" />Recruiter</p>
                    {items.map((item) => <NavLink key={item.id} to={item.path} onClick={onClose} className="block no-underline">
                        {({ isActive }) => <span className={`flex items-center gap-2.5 rounded-lg border-l-2 py-2.5 pl-5 pr-2.5 text-sm font-medium transition-colors ${isActive ? 'border-l-[#a99aff] bg-[#8b7bff]/10 text-[#f0eeff]' : 'border-l-transparent text-[#a7a1bd] hover:bg-[#1b1928] hover:text-[#f0eeff]'}`}><span className={`w-2.5 font-mono text-[#a99aff] transition-all ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'}`}>&gt;</span><span className={`flex h-7 w-7 items-center justify-center rounded-md border text-sm ${isActive ? 'border-[#a99aff]/35 text-[#a99aff]' : 'border-[#302c42] bg-[#171522] text-[#a7a1bd]'}`}><i className={`bi ${item.icon}`} /></span><span className="flex-1">{item.label}</span></span>}
                    </NavLink>)}
                </nav>
                <div className="border-t border-white/[0.06] bg-[#15131e] p-4"><div className="rounded-xl border border-[#302c42] bg-[#1a1726] p-3"><p className="font-mono text-[10px] uppercase tracking-wider text-[#817a99]">Hiring workspace</p><p className="mt-1 text-xs leading-5 text-[#bcb6cc]">Candidate profile saved for review.</p></div></div>
            </aside>
        </>
    );
};

RecruiterSidebar.propTypes = { isOpen: PropTypes.bool.isRequired, items: PropTypes.array.isRequired, onClose: PropTypes.func.isRequired };
export default RecruiterSidebar;
