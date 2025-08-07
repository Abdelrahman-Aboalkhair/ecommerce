import { gql } from "@apollo/client";

export const GET_PRODUCTS_SUMMARY = gql`
  query GetFlaggedProducts($first: Int, $flags: [String!]) {
    products(first: $first, filters: { flags: $flags }) {
      products {
        id
        slug
        name
        isNew
        isFeatured
        isTrending
        isBestSeller
        averageRating
        reviewCount
        variants {
          id
          price
          images
          stock
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $skip: Int, $filters: ProductFilters) {
    products(first: $first, skip: $skip, filters: $filters) {
      products {
        id
        name
        slug
        isNew
        isFeatured
        isTrending
        isBestSeller
        averageRating
        reviewCount
        variants {
          id
          sku
          price
          images
          stock
          lowStockThreshold
          barcode
          warehouseLocation
        }
        category {
          id
          name
          slug
        }
        reviews {
          id
          rating
          comment
        }
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_SINGLE_PRODUCT = gql`
  query GetSingleProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      isNew
      isFeatured
      isTrending
      isBestSeller
      averageRating
      reviewCount
      description
      variants {
        id
        sku
        price
        images
        stock
        lowStockThreshold
        barcode
        warehouseLocation
        attributes {
          id
          attribute {
            id
            name
            slug
          }
          value {
            id
            value
            slug
          }
        }
      }
      category {
        id
        name
        slug
      }
      reviews {
        id
        rating
        comment
        user {
          id
          name
          email
        }
        createdAt
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      slug
      name
      description
    }
  }
`;
