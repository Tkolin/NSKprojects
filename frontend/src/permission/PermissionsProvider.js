import React, { createContext, useContext } from 'react';

// Создаем контекст
const PermissionsContext = createContext([]);

// Создаем провайдер
export const PermissionsProvider = ({  children }) => {
    const permissions = JSON.parse(localStorage.getItem("userPermissions"));

    // console.log(": = : value", permissions);
    // console.log(": = : value?.map(row=>row.name_key", permissions?.map(row=>row.name_key));
    return (
        <PermissionsContext.Provider value={permissions?.map(row=>row.name_key)}>
            {children}
        </PermissionsContext.Provider>
    );
};

// Хук для использования контекста
export const usePermissions = () => {
    return useContext(PermissionsContext);
};
