import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GRAPHQL_URL } from "./constants/config";
import { isDemoMode } from "@/app/lib/demo";
import { demoApolloLink } from "@/app/lib/demo/demoApolloLink";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.error("GraphQL Error", graphQLErrors);
  if (networkError) console.error("Network Error", networkError);
});
export const initializeApollo = (initialState = null) => {
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    credentials: "include",
  });

  const link = isDemoMode()
    ? from([errorLink, demoApolloLink, httpLink])
    : from([errorLink, httpLink]);

  const client = new ApolloClient({
    link,
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
