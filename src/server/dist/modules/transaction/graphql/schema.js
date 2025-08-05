"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const schema_1 = require("@graphql-tools/schema");
const resolver_1 = require("@/modules/product/graphql/resolver");
const typeDefs = (0, graphql_tag_1.default) `
  type transaction {
    id: String!
    orderId: String!
    status: String!
  }

  type Order {
    id: String!
    amount: Int!
    userId: Int!
  }

  type Review {
    id: String!
    rating: Float!
    comment: String
  }

  type Query {
    transactions: [Product!]
    transaction(slug: String!): Product
  }
`;
exports.transactionSchema = (0, schema_1.makeExecutableSchema)({
    typeDefs: typeDefs,
    resolvers: resolver_1.productResolvers,
});
