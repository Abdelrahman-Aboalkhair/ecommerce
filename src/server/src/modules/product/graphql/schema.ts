import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { productResolvers } from "./resolver";

const typeDefs = gql`
  scalar DateTime

  type Product {
    id: String!
    slug: String!
    name: String!
    description: String
    salesCount: Int!
    isNew: Boolean!
    isFeatured: Boolean!
    isTrending: Boolean!
    isBestSeller: Boolean!
    averageRating: Float!
    reviewCount: Int!
    variants: [ProductVariant!]!
    category: Category
    reviews: [Review!]!
  }

  type ProductVariant {
    id: String!
    sku: String!
    images: [String!]!
    price: Float!
    stock: Int!
    lowStockThreshold: Int!
    barcode: String
    warehouseLocation: String
    attributes: [ProductVariantAttribute!]!
  }

  type ProductVariantAttribute {
    id: String!
    attribute: Attribute!
    value: AttributeValue!
  }

  type Attribute {
    id: String!
    name: String!
    slug: String!
  }

  type AttributeValue {
    id: String!
    value: String!
    slug: String!
  }

  type Review {
    id: String!
    rating: Int!
    comment: String
    user: User
    createdAt: DateTime!
  }

  type User {
    id: String!
    name: String!
    email: String!
    avatar: String
  }

  type Category {
    id: String!
    slug: String!
    name: String!
    description: String
  }

  type ProductConnection {
    products: [Product!]!
    hasMore: Boolean!
    totalCount: Int!
  }

  input ProductFilters {
    search: String
    isNew: Boolean
    isFeatured: Boolean
    isTrending: Boolean
    isBestSeller: Boolean
    minPrice: Float
    maxPrice: Float
    categoryId: String
    flags: [String!]
  }

  type Query {
    products(first: Int, skip: Int, filters: ProductFilters): ProductConnection!
    product(slug: String!): Product
    newProducts(first: Int, skip: Int): ProductConnection!
    featuredProducts(first: Int, skip: Int): ProductConnection!
    trendingProducts(first: Int, skip: Int): ProductConnection!
    bestSellerProducts(first: Int, skip: Int): ProductConnection!
    categories: [Category!]!
  }
`;

export const productSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: productResolvers,
});
