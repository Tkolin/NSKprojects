import React, { useMemo } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider as ApolloHooksProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Cookies } from 'react-cookie';
const httpLink = createHttpLink({

    uri: `${process.env.REACT_APP_API_URL}graphql/`,
});
console.log(process.env.REACT_APP_API_URL);

const createApolloClient = () => {
    const authLink = setContext((_, { headers }) => {
        const cookies = new Cookies();
        const token = cookies.get('accessToken');
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
};

const ApolloProvider = ({ children }) => {
    const client = useMemo(() => createApolloClient(), []);
    return <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>;
};

export default ApolloProvider;