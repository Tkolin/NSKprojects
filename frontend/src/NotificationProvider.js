import React from 'react';
import { notification } from 'antd';

export const NotificationContext = React.createContext();

export const NotificationProvider = ({ children }) => {
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    return (
        <NotificationContext.Provider value={{ openNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};