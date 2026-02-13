import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, LogOut, Calendar, Folder, Grid, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Folder, label: 'Projects', path: '/projects' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' }, // Shortened label for mobile
        { icon: Users, label: 'Meeting Vault', path: '/meetings' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ];

    // On mobile, sidebar acts as bottom dock. We only show first 3 items + Menu
    // On desktop, we show everything.
    const visibleNavItems = isMobile ? navItems.slice(0, 3) : navItems;

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
                <div className={`mobile-overlay ${isMenuOpen ? 'open' : ''}`}>
                    <button className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
                        <X size={24} />
                    </button>

                    <div className="mobile-grid">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="mobile-app-card"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <div className="mobile-app-icon">
                                    <item.icon size={24} />
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <button
                            onClick={logout}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 77, 77, 0.1)',
                                border: '1px solid rgba(255, 77, 77, 0.3)',
                                color: '#ff4d4d',
                                padding: '16px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            <LogOut size={20} />
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
