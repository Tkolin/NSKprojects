// frontend/src/ApolloProvider.js

import React, { useMemo } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider as ApolloHooksProvider, useMutation } from '@apollo/client';
import { ADD_CONTACT_MUTATION, CONTACTS_QUERY } from './graphql/queries';

const createApolloClient = () => {
    return new ApolloClient({
        uri: 'http://localhost:8000/graphql', // Замените на адрес вашего GraphQL-сервера
        cache: new InMemoryCache(),
    });
};

const ApolloProvider = ({ children }) => {
    const client = useMemo(() => createApolloClient(), []); // Используем useMemo для сохранения клиента между рендерами

    const [addContact] = useMutation(ADD_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onError: (error) => {
            console.error("GraphQL mutation error:", error);
            // Добавьте обработку ошибок, если необходимо
        },
    });

    return <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>;
};

export default ApolloProvider;
