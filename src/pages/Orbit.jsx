import React, { useState, useEffect } from 'react';
import GlassCard from '../components/shared/GlassCard';
import { Rocket, TrendingUp, DollarSign, ShoppingCart, Activity, Target, MousePointerClick, Eye, Megaphone, TrendingDown } from 'lucide-react';
import DateRangePicker from '../components/shared/DateRangePicker';
import shopifyService from '../services/shopify';
import metaAdsService from '../services/meta';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const Orbit = () => {
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [salesData, setSalesData] = useState(null);
    const [adsData, setAdsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [sData, aData] = await Promise.all([
                    shopifyService.fetchSalesData(dateRange),
                    metaAdsService.fetchAdsData(dateRange)
                ]);
                setSalesData(sData);
                setAdsData(aData);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [dateRange]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Custom tool tip for chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'rgba(20,20,20,0.95)', border: '1px solid var(--color-border-glass)', borderRadius: '8px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    <p style={{ margin: '0 0 8px 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{label}</p>
                    <p style={{ margin: 0, color: 'var(--color-gold-primary)', fontWeight: 'bold' }}>{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--color-gold-primary)', color: '#000', padding: '12px', borderRadius: '12px' }}>
                        <Rocket size={28} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, color: 'var(--color-gold-primary)', fontSize: '2rem' }}>Orbit</h1>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>E-commerce Command Center</p>
                    </div>
                </div>

                {/* Global Date Controls */}
                <div style={{ zIndex: 10 }}>
                    <DateRangePicker onChange={setDateRange} defaultRange="last7days" />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px' }}>Syncing telemetry...</div>
            ) : (
                <>
                    {/* Top Tier KPIs - Business Health */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <KpiCard title="Total Sales" value={formatCurrency(salesData?.totalSales)} icon={DollarSign} trend="+12.5%" />
                        <KpiCard title="Total Orders" value={salesData?.totalOrders} icon={ShoppingCart} trend="+5.2%" />
                        <KpiCard title="Total Ad Spend" value={formatCurrency(adsData?.totalSpend)} icon={Megaphone} trend="-2.1%" alert={true} />
                        <KpiCard title="Estimated Profit" value={formatCurrency(salesData?.profit)} icon={TrendingUp} trend="+10.1%" />
                    </div>

                    {/* Second Tier KPIs - Ad Performance */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <KpiCard title="Global ROAS" value={adsData?.roas?.toFixed(2) + 'x'} icon={Target} trend="+0.5%" />
                        <KpiCard title="Cost Per Purchase" value={formatCurrency(adsData?.cpa)} icon={DollarSign} trend="-5.0%" reverseTrendColor={true} />
                        <KpiCard title="Blended CPA" value={formatCurrency((adsData?.totalSpend / salesData?.totalOrders) || 0)} icon={Activity} />
                        <KpiCard title="Click-Through Rate" value={adsData?.ctr?.toFixed(2) + '%'} icon={MousePointerClick} />
                    </div>

                    {/* Main Split Layout */}
                    <div style={{ display: 'flex', gap: '24px', flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
                        <GlassCard style={{ flex: 2 }}>
                            <h3 style={{ margin: '0 0 24px 0', color: 'var(--color-text-main)' }}>Sales Trend</h3>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData?.salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-gold-primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--color-gold-primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="date" stroke="var(--color-text-muted)" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="var(--color-text-muted)" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="sales" stroke="var(--color-gold-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>

                        <GlassCard style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text-main)' }}>Hero Products</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {salesData?.topProducts.map(product => (
                                    <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: 'var(--color-text-main)', fontSize: '0.9rem', fontWeight: 500 }}>{product.name}</div>
                                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{product.orders} orders</div>
                                        </div>
                                        <div style={{ color: 'var(--color-gold-primary)', fontWeight: 'bold' }}>
                                            {formatCurrency(product.sales)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Campaign Performance Table */}
                    <GlassCard>
                        <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={20} color="var(--color-gold-primary)" />
                            Campaign Performance
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border-glass)' }}>
                                        <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Campaign</th>
                                        <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                                        <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Spend</th>
                                        <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>ROAS</th>
                                        <th style={{ padding: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Purchases (Click / View)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adsData?.campaigns.map(camp => (
                                        <tr key={camp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                            <td style={{ padding: '16px 12px', color: 'var(--color-text-main)', fontWeight: 500 }}>{camp.name}</td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    background: camp.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: camp.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                                                }}>
                                                    {camp.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 12px', color: 'var(--color-text-main)' }}>{formatCurrency(camp.spend)}</td>
                                            <td style={{ padding: '16px 12px', color: camp.roas > 2 ? '#10b981' : (camp.roas > 1 ? 'var(--color-gold-primary)' : '#ef4444'), fontWeight: 'bold' }}>
                                                {camp.roas.toFixed(2)}x
                                            </td>
                                            <td style={{ padding: '16px 12px', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>{camp.purchases} total</span>
                                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                                    (<MousePointerClick size={12} style={{ verticalAlign: 'middle' }} /> {camp.clickPurchases} / <Eye size={12} style={{ verticalAlign: 'middle' }} /> {camp.viewPurchases})
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </>
            )}
        </div>
    );
};

// Mini Component for KPI Cards
const KpiCard = ({ title, value, icon: Icon, trend, reverseTrendColor = false, alert = false }) => {
    const isPositive = trend?.startsWith('+');
    // For things like Cost per Purchase, a negative trend (down) is actually good.
    const isGoodTrend = reverseTrendColor ? !isPositive : isPositive;

    return (
        <GlassCard style={{ padding: '20px', border: alert ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</span>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px', color: 'var(--color-text-muted)' }}>
                    <Icon size={18} />
                </div>
            </div>
            <div style={{ color: 'var(--color-text-main)', fontSize: '1.8rem', fontWeight: 'bold' }}>
                {value}
            </div>
            {trend && (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: isGoodTrend ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {trend} vs last period
                </div>
            )}
        </GlassCard>
    );
};

export default Orbit;
