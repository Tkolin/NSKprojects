import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';

import { createRoot } from 'react-dom/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
});

const root = document.getElementById('root');

const reactRoot = createRoot(root);

reactRoot.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
