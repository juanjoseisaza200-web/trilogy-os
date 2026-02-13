import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, LogOut, Calendar, Folder } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Folder, label: 'Projects', path: '/projects' },
        { icon: Users, label: 'Meeting Vault', path: '/meetings' },
        { icon: CheckSquare, label: 'Task Master', path: '/tasks' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ];

    return (
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
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="user-area">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
