// Live Shopify API Service using GraphQL
// Connects securely using environment variables

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

// Helper to format Shopify dates into YYYY-MM-DD
const formatDateForShopify = (date) => {
  return date.toISOString();
};

// GraphQL Query to fetch essential Sales and Orders data over a period.
// We query orders within the date range, then process them client side to extract KPIs.
const buildGqlQuery = (startDate, endDate) => `
{
  orders(first: 250, query: "created_at:>=${formatDateForShopify(startDate)} AND created_at:<=${formatDateForShopify(endDate)}") {
    edges {
      node {
        id
        createdAt
        totalPriceSet {
          shopMoney {
            amount
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              product {
                id
              }
              discountedTotalSet {
                 shopMoney {
                   amount
                 }
              }
            }
          }
        }
      }
    }
  }
}
`;

const shopifyService = {
  fetchSalesData: async (dateRange) => {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
      console.error("Missing Shopify Credentials in .env.local");
      return getFallbackData(); // Return empty schema so UI doesn't crash
    }

    try {
      // Default to last 7 days if no range provided
      let start = dateRange?.start;
      let end = dateRange?.end;
      if (!start || !end) {
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 7);
      }

      const response = await fetch(`/api/shopify/admin/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: buildGqlQuery(start, end)
        })
      });

      const result = await response.json();

      if (result.errors) {
        console.error("Shopify GraphQL Errors:", result.errors);
        return getFallbackData();
      }

      const orders = result.data?.orders?.edges || [];

      // Process the raw orders data
      let totalSales = 0;
      const totalOrders = orders.length;
      const productCounter = {}; // Track product performance
      const dailySalesMap = {};  // Track exact daily sales

      orders.forEach(edge => {
        const order = edge.node;
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const orderValue = parseFloat(order.totalPriceSet.shopMoney.amount);

        // Aggregate total sales
        totalSales += orderValue;

        // Aggregate daily sales for trend chart
        if (!dailySalesMap[orderDate]) {
          dailySalesMap[orderDate] = 0;
        }
        dailySalesMap[orderDate] += orderValue;

        // Aggregate product data for Hero Products
        order.lineItems.edges.forEach(lineItemEdge => {
          const item = lineItemEdge.node;
          const itemValue = parseFloat(item.discountedTotalSet.shopMoney.amount);
          if (!productCounter[item.title]) {
            productCounter[item.title] = { id: item.product?.id || item.title, name: item.title, orders: 0, sales: 0 };
          }
          productCounter[item.title].orders += 1;
          productCounter[item.title].sales += itemValue;
        });
      });

      // Calculate formatted data
      const aov = totalOrders > 0 ? (totalSales / totalOrders) : 0;
      const profit = totalSales * 0.45; // Simulated 45% margin, customizable later

      // Transform daily map to array for Recharts
      const salesTrend = Object.keys(dailySalesMap)
        .sort((a, b) => new Date(a) - new Date(b)) // Ensure chronological
        .map(date => ({
          date: date,
          sales: dailySalesMap[date]
        }));

      // Transform product map to sorted array
      const topProducts = Object.values(productCounter)
        .sort((a, b) => b.sales - a.sales) // Sort by highest sales
        .slice(0, 5); // Take top 5

      return {
        totalSales,
        totalOrders,
        aov,
        profit,
        salesTrend: salesTrend.length > 0 ? salesTrend : [{ date: new Date().toLocaleDateString(), sales: 0 }],
        topProducts
      };

    } catch (error) {
      console.error("Error communicating with Shopify:", error);
      return getFallbackData();
    }
  }
};

// Provides zero'd safe data if the API connection fails or auth is missing
function getFallbackData() {
  return {
    totalSales: 0,
    totalOrders: 0,
    aov: 0,
    profit: 0,
    salesTrend: [{ date: new Date().toLocaleDateString(), sales: 0 }],
    topProducts: []
  }
}

export default shopifyService;
