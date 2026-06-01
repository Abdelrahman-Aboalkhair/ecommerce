import { ApolloLink, Observable } from "@apollo/client";
import {
  DEMO_ALL_ANALYTICS,
  DEMO_ANALYTICS_OVERVIEW,
  DEMO_SEARCH_RESULTS,
} from "./graphqlFixtures";

export const demoApolloLink = new ApolloLink((operation, forward) => {
  const name = operation.operationName;

  if (name === "GetAnalyticsOverview") {
    return Observable.of({
      data: DEMO_ANALYTICS_OVERVIEW,
    });
  }

  if (name === "GetAllAnalytics") {
    return Observable.of({
      data: DEMO_ALL_ANALYTICS,
    });
  }

  if (name === "SearchDashboard") {
    return Observable.of({
      data: { searchDashboard: DEMO_SEARCH_RESULTS },
    });
  }

  return forward(operation);
});
