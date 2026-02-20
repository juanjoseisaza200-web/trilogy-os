// Mock Instagram Service for Phase 3 UI Development
// This will be replaced with actual API calls to Instagram Graph API later.

const instagramService = {
    // Generate mock data based on date range
    fetchSocialData: async (dateRange) => {
        // Simulate network delay
        return new Promise((resolve) => setTimeout(() => {
            // Mock data structure
            resolve({
                followers: 45200,
                newFollowers: 1250,
                reach: 125000,
                engagementRate: 4.2, // Percentage
                profileViews: 15400,
                websiteClicks: 3200,
                recentPosts: [
                    { id: 'p1', type: 'Reel', thumbnail: 'https://via.placeholder.com/80', likes: 4500, comments: 320, plays: 45000, date: '2h ago' },
                    { id: 'p2', type: 'Carousel', thumbnail: 'https://via.placeholder.com/80', likes: 1200, comments: 85, reach: 12000, date: '1d ago' },
                    { id: 'p3', type: 'Image', thumbnail: 'https://via.placeholder.com/80', likes: 850, comments: 45, reach: 8500, date: '2d ago' },
                ]
            });
        }, 600));
    }
};

export default instagramService;
