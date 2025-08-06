import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.error("GraphQL Error", graphQLErrors);
  if (networkError) console.error("Network Error", networkError);
});

export const initializeApollo = (initialState = null) => {
  const httpLink = new HttpLink({
    uri: "https://full-stack-ecommerce-n5at.onrender.com/api/v1/graphql",
    credentials: "include",
  });

  // Create or reuse Apollo Client instance
  const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          fields: {
            variants: {
              merge: true,
            },
          },
        },
      },
    }).restore(initialState || {}),
  });

  return client;
};

export default initializeApollo(); // Default export for client-side usage
