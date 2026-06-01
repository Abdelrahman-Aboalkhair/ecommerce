export const DEMO_ANALYTICS_OVERVIEW = {
  revenueAnalytics: {
    totalRevenue: 48250.75,
    changes: { revenue: 12.4 },
    monthlyTrends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      revenue: [6200, 7100, 6800, 8200, 9100, 10850],
    },
  },
  orderAnalytics: {
    totalOrders: 384,
    totalSales: 412,
    changes: { sales: 8.2, orders: 6.1 },
  },
  userAnalytics: {
    totalUsers: 1284,
    changes: { users: 15.3 },
  },
  yearRange: { minYear: 2023, maxYear: 2026 },
  interactionAnalytics: {
    totalInteractions: 9240,
    byType: { views: 6100, clicks: 2400, others: 740 },
  },
  productPerformance: [
    { id: "demo-prod-1", name: "Smartphone X", quantity: 86, revenue: 51593 },
    { id: "demo-prod-5", name: "Running Sneakers", quantity: 142, revenue: 17038 },
    { id: "demo-prod-2", name: "Wireless Headphones Pro", quantity: 64, revenue: 9599 },
  ],
};

export const DEMO_ALL_ANALYTICS = {
  ...DEMO_ANALYTICS_OVERVIEW,
  revenueAnalytics: {
    ...DEMO_ANALYTICS_OVERVIEW.revenueAnalytics,
    monthlyTrends: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      revenue: [6200, 7100, 6800, 8200, 9100, 10850],
      orders: [42, 48, 45, 55, 61, 72],
      sales: [44, 50, 47, 57, 64, 75],
      users: [12, 18, 15, 22, 28, 35],
    },
  },
  orderAnalytics: {
    totalOrders: 384,
    totalSales: 412,
    averageOrderValue: 125.65,
    changes: { orders: 6.1, sales: 8.2, averageOrderValue: 3.4 },
  },
  userAnalytics: {
    totalUsers: 1284,
    totalRevenue: 48250.75,
    retentionRate: 0.42,
    lifetimeValue: 186.5,
    repeatPurchaseRate: 0.31,
    engagementScore: 72,
    changes: { users: 15.3 },
    topUsers: [
      {
        id: "demo-user-1",
        name: "Demo User",
        email: "user@example.com",
        orderCount: 5,
        totalSpent: 1249.5,
        engagementScore: 88,
      },
    ],
    interactionTrends: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      views: [820, 910, 880, 1020, 1150, 1340, 980],
      clicks: [210, 240, 230, 280, 310, 360, 250],
      others: [40, 55, 48, 62, 70, 85, 52],
    },
  },
  interactionAnalytics: {
    ...DEMO_ANALYTICS_OVERVIEW.interactionAnalytics,
    mostViewedProducts: [
      { productId: "demo-prod-1", productName: "Smartphone X", viewCount: 1240 },
      { productId: "demo-prod-5", productName: "Running Sneakers", viewCount: 980 },
    ],
  },
};

export const DEMO_SEARCH_RESULTS = [
  {
    type: "product",
    id: "demo-prod-1",
    title: "Smartphone X",
    description: "Flagship smartphone demo listing",
  },
  {
    type: "order",
    id: "demo-order-1",
    title: "Order demo-order-1",
    description: "Delivered — $749.98",
  },
  {
    type: "user",
    id: "demo-user-1",
    title: "Demo User",
    description: "user@example.com",
  },
];
