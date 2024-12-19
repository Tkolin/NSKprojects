import {
  ApolloClient,
  ApolloProvider as ApolloHooksProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React, { useMemo } from "react";
import { Cookies } from "react-cookie";
import getCsrfToken from "./setupAxios";

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_GRAPHQL_API_URL}`,
});

const createApolloClient = () => {
  const authLink = setContext((_, { headers }) => {
    // console.log("setContext");
    const cookies = new Cookies();
    const token = localStorage.getItem("accessToken");
    const CsrfToken = getCsrfToken();
    // console.log("token",token);
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
        "X-CSRF-TOKEN": CsrfToken,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Passport: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        Project: {
          keyFields: ["id"],
          fields: {
            project_irds: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            project_stages: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            project_tasks: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
};

const ApolloProvider = ({ children }) => {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>;
};

export default ApolloProvider;
