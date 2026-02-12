import React from 'react';
import Sidebar from './Sidebar';
import UserProfile from '../shared/UserProfile';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '20px'
                }}>
                    <UserProfile />
                </div>
                {children}
            </main>
        </div>
    );
};

export default Layout;
