import React from 'react';
import './GlassButton.css';

const GlassButton = ({ children, variant = 'primary', className = '', ...props }) => {
    return (
        <button className={`glass-button ${variant} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default GlassButton;
