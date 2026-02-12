import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/shared/GlassCard';
import airtableService from '../services/airtable';
import { Users, CheckSquare, ArrowRight } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [recentMeetings, setRecentMeetings] = React.useState([]);
    const [recentTasks, setRecentTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const meetings = await airtableService.fetchMeetings();
                setRecentMeetings(meetings.slice(0, 3));

                const tasks = await airtableService.fetchTasks();
                setRecentTasks(tasks.slice(0, 3));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const ActivityItem = ({ title, subtitle, date, status, linkTo }) => (
        <Link to={linkTo} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
                padding: '12px',
                borderBottom: '1px solid var(--color-border-glass)',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
            }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{title}</h4>
                    {date && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{date}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{subtitle}</p>
                    {status && (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: status === 'Done' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            color: status === 'Done' ? '#10b981' : 'var(--color-text-muted)'
                        }}>
                            {status}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );

    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ color: 'var(--color-text-main)', fontSize: '2.5rem', marginBottom: '8px' }}>
                    Welcome back, <span style={{ color: 'var(--color-gold-primary)' }}>{user || 'Team'}</span>.
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Here is what is happening at Trilogy.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Meetings Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Link to="/meetings" style={{ textDecoration: 'none' }}>
                        <GlassCard className="dashboard-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-gold-primary)' }}>
                                    <Users size={24} />
                                </div>
                                <ArrowRight size={20} color="var(--color-text-muted)" />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--color-text-main)' }}>Meeting Vault</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Access team logs and archives.</p>
                        </GlassCard>
                    </Link>

                    <GlassCard style={{ flex: 1, padding: '20px' }}>
                        <h4 style={{ color: 'var(--color-gold-primary)', margin: '0 0 16px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Recent Meetings
                        </h4>
                        {loading ? (
                            <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
                        ) : (
                            <div>
                                {recentMeetings.map(m => (
                                    <ActivityItem
                                        key={m.id}
                                        title={m.title}
                                        date={m.date}
                                        subtitle={m.attendees ? `Attendees: ${m.attendees}` : 'No attendees'}
                                        linkTo={`/meetings?id=${m.id}`}
                                    />
                                ))}
                                {recentMeetings.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No recent meetings.</p>}
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Tasks Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Link to="/tasks" style={{ textDecoration: 'none' }}>
                        <GlassCard className="dashboard-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-gold-primary)' }}>
                                    <CheckSquare size={24} />
                                </div>
                                <ArrowRight size={20} color="var(--color-text-muted)" />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--color-text-main)' }}>Task Master</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Track projects and statuses.</p>
                        </GlassCard>
                    </Link>

                    <GlassCard style={{ flex: 1, padding: '20px' }}>
                        <h4 style={{ color: 'var(--color-gold-primary)', margin: '0 0 16px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Active Tasks
                        </h4>
                        {loading ? (
                            <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
                        ) : (
                            <div>
                                {recentTasks.map(t => (
                                    <ActivityItem
                                        key={t.id}
                                        title={t.title}
                                        subtitle={t.assignee ? `Assigned to: ${t.assignee}` : 'Unassigned'}
                                        status={t.status}
                                        linkTo={`/tasks?id=${t.id}`}
                                    />
                                ))}
                                {recentTasks.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No active tasks.</p>}
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
