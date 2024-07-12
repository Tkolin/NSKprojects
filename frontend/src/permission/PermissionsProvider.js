import React, { createContext, useContext, useMemo } from 'react';

// Создаем контекст
const PermissionsContext = createContext([]);

// Создаем провайдер
export const PermissionsProvider = ({ permissions, children }) => {
    const value = useMemo(() => permissions, [permissions]);

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
};

// Хук для использования контекста
export const usePermissions = () => {
    return useContext(PermissionsContext);
};
