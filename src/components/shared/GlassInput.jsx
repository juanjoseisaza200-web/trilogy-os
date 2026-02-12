import React from 'react';
import './GlassInput.css';

const GlassInput = ({ className = '', ...props }) => {
    return (
        <input className={`glass-input ${className}`} {...props} />
    );
};

export default GlassInput;
