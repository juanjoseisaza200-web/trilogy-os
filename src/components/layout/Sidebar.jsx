import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, LogOut, Calendar, Folder, Grid, X, Rocket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    // Default dock items
    const defaultDock = ['/', '/projects', '/tasks', '/command-center'];

    // Initialize from local storage or default
    const [dockItems, setDockItems] = React.useState(() => {
        const saved = localStorage.getItem('trilogy_dock_prefs');
        return saved ? JSON.parse(saved) : defaultDock;
    });

    React.useEffect(() => {
        localStorage.setItem('trilogy_dock_prefs', JSON.stringify(dockItems));
    }, [dockItems]);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Rocket, label: 'Command Center', path: '/command-center' },
        { icon: Folder, label: 'Projects', path: '/projects' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: Users, label: 'Meeting Vault', path: '/meetings' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ];

    const toggleDockItem = (path) => {
        if (dockItems.includes(path)) {
            // Remove, but prevent empty logic if desired (optional)
            setDockItems(prev => prev.filter(p => p !== path));
        } else {
            // Add, limit to 4
            if (dockItems.length < 4) {
                setDockItems(prev => [...prev, path]);
            }
        }
    };

    // On mobile, show items that are in the dockItems array + Menu
    const visibleNavItems = isMobile
        ? navItems.filter(item => dockItems.includes(item.path))
        : navItems;

    return (
        <>
            <aside className="sidebar">
                <div className="logo-area" style={{ padding: '0 20px', marginBottom: '40px' }}>
                    <img
                        src="/assets/trilogy-logo.png"
                        alt="Trilogy"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block'
                        }}
                    />
                </div>

                <nav className="nav-menu">
                    {visibleNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)} // Close menu if dock item clicked
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <button
                            className={`nav-item ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                        >
                            <Grid size={20} />
                            <span>Menu</span>
                        </button>
                    )}
                </nav>

                <div className="user-area">
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay (Command Center) */}
            {isMobile && (
                <div
                    className={`mobile-overlay ${isMenuOpen ? 'open' : ''}`}
                    onTouchStart={(e) => {
                        window.touchStartY = e.touches[0].clientY;
                    }}
                    onTouchEnd={(e) => {
                        const touchEndY = e.changedTouches[0].clientY;
                        const deltaY = touchEndY - window.touchStartY;
                        // If swipe down > 50px
                        if (deltaY > 50) {
                            setIsMenuOpen(false);
                            setIsEditing(false);
                        }
                    }}
                >
                    {/* Header Row: Close Button + toggle edit */}
                    <div style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        left: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 2001
                    }}>
                        {/* Edit Toggle */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                            style={{
                                background: isEditing ? 'var(--color-gold-primary)' : 'rgba(255,255,255,0.05)',
                                color: isEditing ? '#000' : 'var(--color-text-muted)',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isEditing ? 'Done' : 'Customize'}
                        </button>

                        <button className="mobile-close-btn" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsEditing(false); }}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="mobile-grid" onClick={(e) => e.stopPropagation()}>
                        {navItems.map((item) => {
                            const isDocked = dockItems.includes(item.path);
                            return (
                                <div
                                    key={item.path}
                                    className={`mobile-app-card ${isEditing && isDocked ? 'docked' : ''}`}
                                    onClick={(e) => {
                                        if (isEditing) {
                                            e.preventDefault();
                                            toggleDockItem(item.path);
                                        } else {
                                            setIsMenuOpen(false);
                                        }
                                    }}
                                // wrapper is div, but inner is link if not editing? 
                                // To simplify, we'll use a div wrapper that handles click
                                >
                                    {/* If not editing, wrap content in Link, otherwise just div content */}
                                    {!isEditing ? (
                                        <NavLink to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                            <div className="mobile-app-icon">
                                                <item.icon size={24} />
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                                        </NavLink>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', opacity: isDocked ? 1 : 0.5 }}>
                                            <div className="mobile-app-icon" style={{ position: 'relative' }}>
                                                <item.icon size={24} />
                                                {/* Badge for docked */}
                                                {isDocked && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        background: 'var(--color-gold-primary)',
                                                        borderRadius: '50%',
                                                        width: '16px',
                                                        height: '16px',
                                                        border: '2px solid #000'
                                                    }} />
                                                )}
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </>
    );
};

export default Sidebar;
