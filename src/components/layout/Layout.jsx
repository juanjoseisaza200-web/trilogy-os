import React from 'react';
import Sidebar from './Sidebar';
import UserProfile from '../shared/UserProfile';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '250px',
                padding: '40px',
                minHeight: '100vh',
                boxSizing: 'border-box',
                position: 'relative' // Ensure positioning context
            }}>
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
