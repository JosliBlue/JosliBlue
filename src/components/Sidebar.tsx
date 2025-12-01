import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface SidebarProps {
    currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {
            method: 'GET',
            path: '/',
            label: 'Welcome',
        },
        {
            method: 'GET',
            path: '/projects',
            label: 'Projects',
        },
        {
            method: 'POST',
            path: '/contact',
            label: 'Contact',
        },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        closeMenu();
    }, [currentPath]);

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {!isMobile && (
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-accent tracking-tight">JosliBlue Dev</h1>
                    <p className="text-xs text-text-secondary mt-1">v1.0.0</p>
                </div>
            )}

            <nav className={`flex-1 ${isMobile ? 'p-6' : 'p-4'}`}>
                <div className="mb-4">
                    <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 px-2">
                        Endpoints
                    </h2>
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <a
                                    href={item.path}
                                    onClick={closeMenu}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                        currentPath === item.path
                                            ? 'bg-accent/10 text-accent font-medium'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/50'
                                    }`}
                                >
                                    <span
                                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded border transition-colors ${
                                            item.method === 'GET'
                                                ? 'bg-[var(--badge-get-bg)] text-[var(--badge-get-text)] border-[var(--badge-get-border)]'
                                                : ''
                                        } ${
                                            item.method === 'POST'
                                                ? 'bg-[var(--badge-post-bg)] text-[var(--badge-post-text)] border-[var(--badge-post-border)]'
                                                : ''
                                        }`}
                                    >
                                        {item.method}
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            isMobile ? 'text-lg' : 'text-sm'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 h-screen bg-bg-secondary border-r border-border/50 fixed left-0 top-0 overflow-y-auto hidden md:flex flex-col z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Header (Title only) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-secondary border-b border-border/50 z-30 flex items-center justify-center px-4">
                <span className="font-bold text-accent">JosliBlue Dev</span>
            </div>

            {/* Mobile Bottom Toggle */}
            <button
                type="button"
                onClick={toggleMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-full bg-accent text-bg-primary shadow-lg hover:scale-110 transition-transform duration-200"
            >
                {isMobileMenuOpen ? (
                    <Icon icon="mdi:close" width="24" height="24" />
                ) : (
                    <Icon icon="mdi:menu" width="24" height="24" />
                )}
            </button>

            {/* Mobile Drawer Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-bg-primary/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}

            {/* Mobile Floating Menu */}
            <div
                className={`fixed inset-0 z-40 md:hidden flex items-center justify-center px-4 transition-all duration-200 ease-out ${
                    isMobileMenuOpen
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible pointer-events-none'
                }`}
                onClick={closeMenu}
            >
                <div
                    className={`bg-bg-secondary border border-border/50 rounded-xl shadow-2xl overflow-hidden w-full max-h-[calc(100vh-10rem)] overflow-y-auto transition-all duration-300 ease-out origin-bottom ${
                        isMobileMenuOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SidebarContent isMobile={true} />
                </div>
            </div>
        </>
    );
};
