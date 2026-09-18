import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';

const GROUPS = {
  portfolio: { label: 'Portfolio', icon: 'bi-collection-fill' },
  ai: { label: 'AI', icon: 'bi-stars' },
};

const SidebarLink = ({ item, onClose, nested = false }) => (
  <NavLink to={item.path} onClick={onClose} className="block no-underline decoration-transparent">
    {({ isActive }) => (
      <span
        className={`flex items-center gap-2.5 rounded-lg border-l-2 py-2.5 pr-2.5 text-sm font-medium transition-colors duration-150
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2b84b]
          ${isActive
            ? 'border-l-[#f2b84b] bg-[#f2b84b]/10 text-[#e7e9f2]'
            : 'border-l-transparent text-[#8b91a6] hover:bg-[#1b1e29] hover:text-[#e7e9f2]'
          } ${nested ? 'pl-5' : 'pl-2'}`}
      >
        <span aria-hidden="true" className={`w-2.5 font-mono text-[13px] text-[#f2b84b] transition-all duration-150 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'}`}>&gt;</span>
        <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border text-sm ${isActive ? 'border-[#f2b84b]/35 bg-transparent text-[#f2b84b]' : 'border-[#262a38] bg-[#15171f] text-[#8b91a6]'}`}>
          <i className={`bi ${item.icon}`} aria-hidden="true" />
        </span>
        <span className="flex-1 truncate">{item.label}</span>
      </span>
    )}
  </NavLink>
);

const OwnerSidebar = ({ items, isOpen, onClose }) => {
  const location = useLocation();
  const activeItem = items.find((item) => item.path === location.pathname);
  const [expandedGroup, setExpandedGroup] = useState(() => activeItem?.group || null);
  const standaloneItems = items.filter((item) => !item.group);

  useEffect(() => {
    if (activeItem?.group) setExpandedGroup(activeItem.group);
  }, [activeItem?.group]);

  const toggleGroup = (group) => {
    setExpandedGroup((current) => (current === group ? null : group));
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

        <aside
          id="owner-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[280px] flex-col
          bg-[#10121a] border-r border-[#262a38] font-sans
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:sticky lg:top-0 lg:h-screen lg:w-[272px] lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* brand */}
          <div className="border-b border-white/[0.06] px-5 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 rounded-md border border-[#262a38] bg-[#15171f] px-2 py-1.5 font-mono text-[15px] font-semibold tracking-tight text-[#565c70]">
                &lt;<em className="text-[#f2b84b] not-italic">F</em>/&gt;
              </span>
              <div>
                <p className="mb-0.5 font-mono text-[11px] text-[#565c70]">{'// owner-panel'}</p>
              </div>
            </div>

            <div className="mt-3.5 inline-flex items-center gap-2 rounded-md border border-[#262a38] bg-[#15171f] px-2.5 py-1.5 font-mono text-[11.5px] text-[#8b91a6]">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57e0c2] shadow-[0_0_0_3px_rgba(87,224,194,0.15)]" />
              <span>{activeItem ? activeItem.id : 'dashboard'}.jsx</span>
            </div>
          </div>

          {/* nav */}
          <nav
            aria-label="Owner navigation"
            className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3.5
              bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px)]
              bg-[length:100%_100%] bg-[position:27px_0] bg-no-repeat"
          >
            <SidebarLink item={standaloneItems[0]} onClose={onClose} />

            {Object.entries(GROUPS).map(([group, details]) => {
              const groupItems = items.filter((item) => item.group === group);
              const isExpanded = expandedGroup === group;
              if (!groupItems.length) return null;

              return (
                <section key={group} className="mt-2">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    aria-expanded={isExpanded}
                    aria-controls={`${group}-owner-menu`}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2b84b] ${isExpanded ? 'bg-[#f2b84b]/[0.06] text-[#c7a35d]' : 'text-[#565c70] hover:bg-[#1b1e29] hover:text-[#aeb4c5]'}`}
                  >
                    <i className={`bi ${details.icon} text-[11px] text-[#f2b84b]/80`} aria-hidden="true" />
                    <span className="flex-1">{details.label}</span>
                    <i className={`bi bi-chevron-down text-[10px] transition-transform duration-300 ease-out motion-reduce:transition-none ${isExpanded ? 'rotate-180 text-[#f2b84b]' : ''}`} aria-hidden="true" />
                  </button>
                  <div id={`${group}-owner-menu`} className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="min-h-0 border-l border-[#262a38] ml-5 mt-1 pl-1">
                      {groupItems.map((item) => <SidebarLink key={item.id} item={item} onClose={onClose} nested />)}
                    </div>
                  </div>
                </section>
              );
            })}

            <div className="mt-2 grid gap-0.5">
              {standaloneItems.slice(1).map((item) => <SidebarLink key={item.id} item={item} onClose={onClose} />)}
            </div>
          </nav>
        </div>

        {/* footer */}
        <div className="border-t border-white/[0.06] bg-[#15171f] px-4 pb-4.5 pt-3.5">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2.5 rounded-lg border border-[#262a38] bg-[#181d2a] px-2.5 py-2.5
              font-mono text-[13px] text-[#e7e9f2] transition-colors duration-150
              hover:border-[#f2b84b]/30 hover:bg-[#1f2636] hover:text-[#f2b84b]
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2b84b]"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[#262a38] bg-[#15171f] text-sm text-[#f2b84b]">
                <i className="bi bi-box-arrow-right"></i>
              </span>
              <span>logout()</span>
            </span>
            <span
              aria-hidden="true"
              className="h-3.5 w-[7px] bg-current opacity-80 animate-pulse motion-reduce:animate-none"
            />
          </button>
        </div>
      </aside>
    </>
  );
};

SidebarLink.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  nested: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

OwnerSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        group: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OwnerSidebar;
