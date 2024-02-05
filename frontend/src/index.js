// Ваш проект/frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';
// Импортируйте createRoot из react-dom/client
import { createRoot } from 'react-dom/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql', // Замените на ваш URL GraphQL-сервера
    cache: new InMemoryCache(),
});

const root = document.getElementById('root');

const reactRoot = createRoot(root);

reactRoot.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
