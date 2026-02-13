import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassCard from '../components/shared/GlassCard';
import airtableService from '../services/airtable';
import { Clock, Plus, Trash2 } from 'lucide-react';
import GlassButton from '../components/shared/GlassButton';
import CreateTaskModal from '../components/shared/CreateTaskModal';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/shared/ConfirmationModal';

import './TaskMaster.css';

const TaskColumn = ({ title, tasks, onStatusChange, onDeleteTask, highlightId }) => {
    return (
        <div className="task-column">
            {/* ... title ... */}
            <h3 style={{
                color: 'var(--color-gold-primary)',
                borderBottom: '1px solid var(--color-border-glass)',
                paddingBottom: '12px',
                marginBottom: '24px'
            }}>
                {title} ({tasks.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tasks.map((task) => {
                    const isHighlighted = task.id === highlightId;
                    return (
                        <div key={task.id} id={`task-${task.id}`}>
                            <GlassCard
                                style={{
                                    padding: '16px',
                                    position: 'relative',
                                    border: isHighlighted ? '2px solid var(--color-gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: isHighlighted ? '0 0 15px rgba(234, 179, 8, 0.3)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <button
                                    onClick={() => onDeleteTask(task.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                    <Trash2 size={14} />
                                </button>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--color-text-main)', paddingRight: '20px' }}>{task.title}</h4>
                                {/* ... rest of card ... */}
                                {task.assignee && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px', margin: '0 0 8px 0' }}>
                                        Assignee: {task.assignee}
                                    </p>
                                )}
                                {task.dueDate && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '12px'
                                    }}>
                                        <Clock size={14} />
                                        <span>{task.dueDate}</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Status:</label>
                                    <select
                                        value={task.status}
                                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid var(--color-border-glass)',
                                            borderRadius: '4px',
                                            color: 'var(--color-text-main)',
                                            padding: '4px 8px',
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                                {task.creator && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        right: '12px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'var(--color-gold-primary)',
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.65rem',
                                        fontWeight: 'bold',
                                        title: `Created by ${task.creator}`,
                                        opacity: 0.8
                                    }}>
                                        {task.creator.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TaskMaster = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [highlightId, setHighlightId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });
    const [activeTab, setActiveTab] = useState('To Do');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Handle URL param for highlighting
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setHighlightId(id);
            // Wait for tasks to load then scroll
            if (tasks.length > 0) {
                setTimeout(() => {
                    const el = document.getElementById(`task-${id}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 500);
            }
        }
    }, [searchParams, tasks]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ... existing code ...

    return (
        <div className="task-master-container">
            <div className="task-header">
                <div>
                    <h1 style={{ color: 'var(--color-gold-primary)', margin: 0 }}>Task Master</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>Project tracking and workflow.</p>
                </div>
                <GlassButton
                    variant="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} />
                    New Task
                </GlassButton>
            </div>

            {/* Mobile Tabs */}
            {isMobile && (
                <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '4px',
                    marginBottom: '24px',
                    border: '1px solid var(--color-border-glass)'
                }}>
                    {['To Do', 'In Progress', 'Done'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                background: activeTab === tab ? 'var(--color-gold-primary)' : 'transparent',
                                color: activeTab === tab ? '#000' : 'var(--color-text-muted)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div style={{ color: 'var(--color-text-muted)' }}>Loading tasks...</div>
            ) : (
                <div className="task-board">
                    {(!isMobile || activeTab === 'To Do') && (
                        <TaskColumn
                            title="To Do"
                            tasks={tasksByStatus['To Do']}
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask}
                            highlightId={highlightId}
                        />
                    )}
                    {(!isMobile || activeTab === 'In Progress') && (
                        <TaskColumn
                            title="In Progress"
                            tasks={tasksByStatus['In Progress']}
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask}
                            highlightId={highlightId}
                        />
                    )}
                    {(!isMobile || activeTab === 'Done') && (
                        <TaskColumn
                            title="Done"
                            tasks={tasksByStatus['Done']}
                            onStatusChange={handleStatusChange}
                            onDeleteTask={handleDeleteTask}
                            highlightId={highlightId}
                        />
                    )}
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
                onConfirm={confirmDeleteTask}
                title="Delete Task"
                message="Are you sure you want to delete this task? This cannot be undone."
                confirmText="Delete Task"
                confirmVariant="danger"
            />

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
};

export default TaskMaster;
