// Mock Meta Ads Service for Phase 2 UI Development
// This will be replaced with actual API calls to Meta Graph API later.

const metaAdsService = {
    // Generate mock data based on date range
    fetchAdsData: async (dateRange) => {
        // Simulate network delay
        return new Promise((resolve) => setTimeout(() => {
            // Mock data structure matching user requirements (Click + View attribution)
            resolve({
                totalSpend: 2150.75,
                totalPurchases: 85,
                cpa: 25.30, // Cost Per Acquisition (Action)
                roas: 3.42, // Return on Ad Spend
                cpm: 12.50, // Cost Per 1000 Impressions
                ctr: 1.8, // Click Through Rate %
                impressions: 172060,
                clicks: 3097,
                campaigns: [
                    {
                        id: 'c1',
                        name: 'Always On - Advantage+ Shopping',
                        status: 'ACTIVE',
                        spend: 1200.50,
                        roas: 4.1,
                        purchases: 55,
                        clickPurchases: 40,
                        viewPurchases: 15
                    },
                    {
                        id: 'c2',
                        name: 'Retargeting - Last 30 Days',
                        status: 'ACTIVE',
                        spend: 450.25,
                        roas: 5.2,
                        purchases: 25,
                        clickPurchases: 20,
                        viewPurchases: 5
                    },
                    {
                        id: 'c3',
                        name: 'Top of Funnel - Broad Interest',
                        status: 'PAUSED',
                        spend: 500.00,
                        roas: 1.1,
                        purchases: 5,
                        clickPurchases: 3,
                        viewPurchases: 2
                    },
                ]
            });
        }, 850));
    }
};

export default metaAdsService;
