// Mock Shopify Service for Phase 1 UI Development
// This will be replaced with actual API calls to Shopify Admin API later.

const shopifyService = {
    // Generate mock data based on date range
    fetchSalesData: async (dateRange) => {
        // Simulate network delay
        return new Promise((resolve) => setTimeout(() => {
            // Mock data structure
            resolve({
                totalSales: 12450.00,
                totalOrders: 142,
                aov: 87.67,
                profit: 4350.50, // Assuming a 35% margin for mock
                salesTrend: [
                    { date: '2023-10-01', sales: 1200 },
                    { date: '2023-10-02', sales: 1500 },
                    { date: '2023-10-03', sales: 1100 },
                    { date: '2023-10-04', sales: 1800 },
                    { date: '2023-10-05', sales: 2100 },
                    { date: '2023-10-06', sales: 1900 },
                    { date: '2023-10-07', sales: 2850 },
                ],
                topProducts: [
                    { id: '1', name: 'Signature T-Shirt', sales: 4500, orders: 45, image: 'https://via.placeholder.com/50' },
                    { id: '2', name: 'Premium Hoodie', sales: 3200, orders: 30, image: 'https://via.placeholder.com/50' },
                    { id: '3', name: 'Classic Cap', sales: 1200, orders: 40, image: 'https://via.placeholder.com/50' },
                ]
            });
        }, 800));
    }
};

export default shopifyService;
