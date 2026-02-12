import React from 'react';
import GlassModal from './GlassModal';
import GlassButton from './GlassButton';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", confirmVariant = "danger" }) => {
    return (
        <GlassModal isOpen={isOpen} onClose={onClose} title={title}>
            <div style={{ padding: '0 0 8px 0' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <GlassButton variant="secondary" onClick={onClose}>
                        Cancel
                    </GlassButton>
                    <GlassButton
                        variant={confirmVariant}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{
                            background: confirmVariant === 'danger' ? 'rgba(255, 77, 77, 0.2)' : undefined,
                            borderColor: confirmVariant === 'danger' ? 'rgba(255, 77, 77, 0.5)' : undefined,
                            color: confirmVariant === 'danger' ? '#ff4d4d' : undefined
                        }}
                    >
                        {confirmText}
                    </GlassButton>
                </div>
            </div>
        </GlassModal>
    );
};

export default ConfirmationModal;
