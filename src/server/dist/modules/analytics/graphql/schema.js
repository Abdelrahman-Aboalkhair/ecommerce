"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsSchema = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const schema_1 = require("@graphql-tools/schema");
const resolver_1 = require("./resolver");
const typeDefs = (0, graphql_tag_1.default) `
  type YearRange {
    minYear: Int!
    maxYear: Int!
  }

  type Changes {
    revenue: Float
    orders: Float
    sales: Float
    users: Float
    averageOrderValue: Float
  }

  type MonthlyTrend {
    labels: [String!]!
    revenue: [Float!]!
    orders: [Int!]!
    sales: [Int!]!
    users: [Int!]!
  }

  type OrderAnalytics {
    totalOrders: Int!
    totalSales: Int!
    averageOrderValue: Float!
    changes: Changes!
  }

  type RevenueAnalytics {
    totalRevenue: Float!
    changes: Changes!
    monthlyTrends: MonthlyTrend!
  }

  type UserAnalytics {
    totalUsers: Int!
    totalRevenue: Float!
    retentionRate: Float!
    lifetimeValue: Float!
    repeatPurchaseRate: Float!
    engagementScore: Float!
    topUsers: [TopUser!]!
    interactionTrends: InteractionTrend!
    changes: Changes!
  }

  type ProductPerformance {
    id: ID!
    name: String!
    quantity: Int!
    revenue: Float!
  }

  type TopUser {
    id: ID!
    name: String!
    email: String!
    orderCount: Int!
    totalSpent: Float!
    engagementScore: Float!
  }

  type InteractionTrend {
    labels: [String!]!
    views: [Int!]!
    clicks: [Int!]!
    others: [Int!]!
  }

  type InteractionByType {
    views: Int!
    clicks: Int!
    others: Int!
  }

  type MostViewedProduct {
    productId: ID!
    productName: String!
    viewCount: Int!
  }

  type InteractionAnalytics {
    totalInteractions: Int!
    byType: InteractionByType!
    mostViewedProducts: [MostViewedProduct!]!
  }

  input DateRangeQueryInput {
    timePeriod: String
    year: Int
    startDate: String
    endDate: String
    category: String
  }

  type SearchResult {
    type: String!
    id: String!
    title: String!
    description: String
  }

  input SearchInput {
    searchQuery: String!
  }

  type AbandonedCartAnalytics {
    totalAbandonedCarts: Int!
    abandonmentRate: Float!
    potentialRevenueLost: Float!
  }

  type Query {
    yearRange: YearRange!
    orderAnalytics(params: DateRangeQueryInput!): OrderAnalytics!
    revenueAnalytics(params: DateRangeQueryInput!): RevenueAnalytics!
    userAnalytics(params: DateRangeQueryInput!): UserAnalytics!
    productPerformance(params: DateRangeQueryInput!): [ProductPerformance!]!
    interactionAnalytics(params: DateRangeQueryInput!): InteractionAnalytics!
    searchDashboard(params: SearchInput!): [SearchResult!]!
    abandonedCartAnalytics(params: DateRangeQueryInput!): AbandonedCartAnalytics!
  }
`;
exports.analyticsSchema = (0, schema_1.makeExecutableSchema)({
    typeDefs: typeDefs,
    resolvers: resolver_1.analyticsResolvers,
});
