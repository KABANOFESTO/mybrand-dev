import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import festo from '../../assets/images/festo.jfif';

const NOTIFICATIONS = [
    {
        id: 'n1',
        title: 'Two recruiters viewed your profile',
        meta: 'Last 24 hours',
        tone: 'info',
    },
    {
        id: 'n2',
        title: 'Certificate needs a freshness update',
        meta: 'Action required',
        tone: 'warning',
    },
    {
        id: 'n3',
        title: 'A pending payment is due this week',
        meta: 'Finance',
        tone: 'success',
    },
];

const OwnerNavbar = ({ activeItem, onMenuToggle, sidebarOpen }) => {
    const [openPanel, setOpenPanel] = useState(null); // 'search' | 'notifications' | null
    const topbarRef = useRef(null);
    const searchInputRef = useRef(null);

    const pageTitle = activeItem?.title || activeItem?.label || 'Dashboard';
    const pageSlug = (activeItem?.label || 'dashboard').toLowerCase().replace(/\s+/g, '-');

    const togglePanel = useCallback((panel) => {
        setOpenPanel((current) => (current === panel ? null : panel));
    }, []);

    const closePanel = useCallback(() => setOpenPanel(null), []);

    useEffect(() => {
        if (openPanel === 'search' && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [openPanel]);

    useEffect(() => {
        if (!openPanel) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') closePanel();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [openPanel, closePanel]);

    useEffect(() => {
        if (!openPanel) return;
        const handleClick = (e) => {
            if (topbarRef.current && !topbarRef.current.contains(e.target)) {
                closePanel();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [openPanel, closePanel]);

    return (
        <header
            ref={topbarRef}
            className="sticky top-0 z-30 border-b border-[#262a38] bg-[#10121a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#10121a]/85"
        >
            <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
                {/* menu toggle + page identity */}
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={sidebarOpen}
                        aria-controls="visitor-sidebar"
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-[#262a38] bg-[#15171f] text-[#8b91a6] transition-colors hover:text-[#e7e9f2] lg:hidden"
                    >
                        <span className="flex h-3.5 w-4 flex-col justify-between">
                            <span
                                className={`h-[1.5px] w-full bg-current transition-transform duration-200 ${sidebarOpen ? 'translate-y-[6px] rotate-45' : ''
                                    }`}
                            />
                            <span
                                className={`h-[1.5px] w-full bg-current transition-opacity duration-200 ${sidebarOpen ? 'opacity-0' : 'opacity-100'
                                    }`}
                            />
                            <span
                                className={`h-[1.5px] w-full bg-current transition-transform duration-200 ${sidebarOpen ? '-translate-y-[6px] -rotate-45' : ''
                                    }`}
                            />
                        </span>
                    </button>

                    <div className="min-w-0">
                        <p className="mb-0.5 truncate font-mono text-[11px] text-[#565c70]">owner/{pageSlug}</p>
                        <h2 className="truncate text-[15px] font-semibold text-[#e7e9f2] sm:text-[17px]" title={pageTitle}>
                            {pageTitle}
                        </h2>
                    </div>
                </div>

                {/* desktop tools */}
                <div className="hidden items-center gap-2.5 lg:flex">
                    <label className="flex w-72 items-center gap-2.5 rounded-lg border border-[#262a38] bg-[#15171f] px-3 py-2 transition-colors focus-within:border-[#f2b84b]/40 xl:w-80">
                        <i className="bi bi-search text-[13px] text-[#8b91a6]" aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Search projects, certificates, payments…"
                            enterKeyHint="search"
                            className="w-full bg-transparent text-[13.5px] text-[#e7e9f2] placeholder:text-[#565c70] focus:outline-none"
                        />
                        <kbd className="rounded border border-[#262a38] bg-[#10121a] px-1.5 py-0.5 font-mono text-[10px] text-[#565c70]">
                            ⌘K
                        </kbd>
                    </label>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => togglePanel('notifications')}
                            aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
                            aria-expanded={openPanel === 'notifications'}
                            aria-haspopup="true"
                            className={`relative flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${openPanel === 'notifications'
                                ? 'border-[#f2b84b]/40 bg-[#f2b84b]/10 text-[#f2b84b]'
                                : 'border-[#262a38] bg-[#15171f] text-[#8b91a6] hover:text-[#e7e9f2]'
                                }`}
                        >
                            <i className="bi bi-bell" aria-hidden="true" />
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#f2b84b] px-1 font-mono text-[10px] font-semibold text-[#10121a]">
                                {NOTIFICATIONS.length}
                            </span>
                        </button>

                        {openPanel === 'notifications' && (
                            <div
                                role="dialog"
                                aria-label="Notifications"
                                className="absolute right-0 top-[calc(100%+10px)] w-80 overflow-hidden rounded-xl border border-[#262a38] bg-[#15171f] shadow-2xl shadow-black/50"
                            >
                                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                                    <div>
                                        <h4 className="text-sm font-semibold text-[#e7e9f2]">Notifications</h4>
                                        <span className="font-mono text-[11px] text-[#565c70]">
                                            {NOTIFICATIONS.length} new updates
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closePanel}
                                        aria-label="Close notifications"
                                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#8b91a6] transition-colors hover:bg-[#1b1e29] hover:text-[#e7e9f2]"
                                    >
                                        <i className="bi bi-x-lg text-xs" aria-hidden="true" />
                                    </button>
                                </div>

                                <ul className="max-h-72 overflow-y-auto py-1">
                                    {NOTIFICATIONS.map((item) => (
                                        <li key={item.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-[#1b1e29]">
                                            <span
                                                className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${item.tone === 'warning' ? 'bg-[#f2b84b]' : 'bg-[#565c70]'
                                                    }`}
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-[13px] text-[#e7e9f2]">{item.title}</p>
                                                <span className="font-mono text-[11px] text-[#8b91a6]">{item.meta}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.06] px-4 py-3 font-mono text-[12px] text-[#8b91a6] transition-colors hover:text-[#f2b84b]"
                                >
                                    view_all_activity()
                                    <i className="bi bi-arrow-right text-xs" aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Open owner profile"
                        className="flex items-center gap-2.5 rounded-lg border border-[#262a38] bg-[#15171f] py-1.5 pl-1.5 pr-3 transition-colors hover:border-[#f2b84b]/30"
                    >
                        <img src={festo} alt="" className="h-7 w-7 rounded-md object-cover" />
                        <span className="text-left leading-tight">
                            <strong className="block text-[13px] font-semibold text-[#e7e9f2]">Kabano Festo</strong>
                            <span className="block font-mono text-[10.5px] text-[#565c70]">owner</span>
                        </span>
                        <i className="bi bi-chevron-down text-[10px] text-[#565c70]" aria-hidden="true" />
                    </button>
                </div>

                {/* mobile tools */}
                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        type="button"
                        onClick={() => togglePanel('search')}
                        aria-label="Open search"
                        aria-expanded={openPanel === 'search'}
                        className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${openPanel === 'search'
                            ? 'border-[#f2b84b]/40 bg-[#f2b84b]/10 text-[#f2b84b]'
                            : 'border-[#262a38] bg-[#15171f] text-[#8b91a6]'
                            }`}
                    >
                        <i className="bi bi-search" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={() => togglePanel('notifications')}
                        aria-label={`Notifications, ${NOTIFICATIONS.length} unread`}
                        aria-expanded={openPanel === 'notifications'}
                        className={`relative flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors ${openPanel === 'notifications'
                            ? 'border-[#f2b84b]/40 bg-[#f2b84b]/10 text-[#f2b84b]'
                            : 'border-[#262a38] bg-[#15171f] text-[#8b91a6]'
                            }`}
                    >
                        <i className="bi bi-bell" aria-hidden="true" />
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#f2b84b] px-1 font-mono text-[10px] font-semibold text-[#10121a]">
                            {NOTIFICATIONS.length}
                        </span>
                    </button>

                    <button type="button" aria-label="Owner profile" className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-md border border-[#262a38]">
                        <img src={festo} alt="" className="h-full w-full object-cover" />
                    </button>
                </div>
            </div>

            {/* mobile search panel */}
            {openPanel === 'search' && (
                <div className="border-t border-white/[0.06] bg-[#10121a] px-4 py-3 lg:hidden">
                    <label className="flex items-center gap-2.5 rounded-lg border border-[#f2b84b]/30 bg-[#15171f] px-3 py-2.5">
                        <i className="bi bi-search text-[13px] text-[#8b91a6]" aria-hidden="true" />
                        <input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Search projects, certificates, payments…"
                            enterKeyHint="search"
                            className="w-full bg-transparent text-[13.5px] text-[#e7e9f2] placeholder:text-[#565c70] focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={closePanel}
                            aria-label="Close search"
                            className="text-[#8b91a6] transition-colors hover:text-[#e7e9f2]"
                        >
                            <i className="bi bi-x-lg text-xs" aria-hidden="true" />
                        </button>
                    </label>
                </div>
            )}
        </header>
    );
};

OwnerNavbar.propTypes = {
    activeItem: PropTypes.shape({
        description: PropTypes.string,
        label: PropTypes.string.isRequired,
        title: PropTypes.string,
    }).isRequired,
    onMenuToggle: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
};

export default OwnerNavbar;
