import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, List, Heading, Eye, Edit2 } from 'lucide-react';

const GlassEditor = ({ value, onChange, placeholder, style }) => {
    const [mode, setMode] = useState('write'); // 'write' or 'preview'

    const handleToolbarClick = (syntax, wrap = true) => {
        const textarea = document.getElementById('glass-editor-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        let newText;
        let newCursorPos;

        if (wrap) {
            const selectedText = text.substring(start, end);
            newText = text.substring(0, start) + syntax + selectedText + syntax + text.substring(end);
            newCursorPos = start + syntax.length;
        } else {
            // For block level items like headers or lists
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            newText = text.substring(0, lineStart) + syntax + text.substring(lineStart);
            newCursorPos = start + syntax.length;
        }

        // Create a synthetic event to trigger onChange
        const event = {
            target: {
                name: 'notes', // Assuming this is used for notes, but generic enough
                value: newText
            }
        };
        onChange(event);

        // Restore focus and cursor (need timeout for React render cycle)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            ...style
        }}>
            {/* Toolbar / Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap', // Allow wrapping on small screens
                gap: '8px', // Add gap for when wrapping occurs
                padding: '8px 12px',
                borderBottom: '1px solid var(--color-border-glass)',
                background: 'rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        type="button"
                        onClick={() => setMode('write')}
                        style={{
                            background: mode === 'write' ? 'var(--color-gold-primary)' : 'transparent',
                            color: mode === 'write' ? '#000' : 'var(--color-text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}
                    >
                        <Edit2 size={14} /> Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('preview')}
                        style={{
                            background: mode === 'preview' ? 'var(--color-gold-primary)' : 'transparent',
                            color: mode === 'preview' ? '#000' : 'var(--color-text-muted)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}
                    >
                        <Eye size={14} /> Preview
                    </button>
                </div>

                {mode === 'write' && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <ToolbarButton icon={Bold} onClick={() => handleToolbarClick('**')} tooltip="Bold" />
                        <ToolbarButton icon={Italic} onClick={() => handleToolbarClick('*')} tooltip="Italic" />
                        <div style={{ width: '1px', background: 'var(--color-border-glass)', margin: '0 4px' }} />
                        <ToolbarButton icon={List} onClick={() => handleToolbarClick('- ', false)} tooltip="List" />
                        <ToolbarButton icon={Heading} onClick={() => handleToolbarClick('### ', false)} tooltip="Heading" />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, minHeight: '200px', position: 'relative' }}>
                {mode === 'write' ? (
                    <textarea
                        id="glass-editor-textarea"
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-main)',
                            fontFamily: 'var(--font-main)', // Use monospace for code editing feel? keeping var(--font-main) for consistency
                            fontSize: '1rem',
                            padding: '16px',
                            resize: 'none',
                            outline: 'none',
                            lineHeight: '1.6'
                        }}
                    />
                ) : (
                    <div className="markdown-preview" style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
                        {value ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 style={{ color: 'var(--color-gold-primary)', fontSize: '1.5rem', marginTop: 0 }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 style={{ color: 'var(--color-gold-primary)', fontSize: '1.3rem' }} {...props} />,
                                    h3: ({ node, ...props }) => <h3 style={{ color: 'var(--color-text-main)', fontSize: '1.1rem', fontWeight: 'bold' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px' }} {...props} />,
                                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ marginBottom: '4px' }} {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '3px solid var(--color-gold-primary)', paddingLeft: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }} {...props} />,
                                    p: ({ node, ...props }) => <p style={{ marginBottom: '12px', lineHeight: '1.6' }} {...props} />,
                                    a: ({ node, ...props }) => <a style={{ color: 'var(--color-gold-primary)', textDecoration: 'underline' }} {...props} />,
                                }}
                            >
                                {value}
                            </ReactMarkdown>
                        ) : (
                            <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Nothing to preview</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ToolbarButton = ({ icon: Icon, onClick, tooltip }) => (
    <button
        type="button"
        onClick={onClick}
        title={tooltip}
        style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
    >
        <Icon size={16} />
    </button>
);

export default GlassEditor;
