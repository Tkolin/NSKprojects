import React, { createContext, useContext } from "react";

// Создаем контекст
const PermissionsContext = createContext([]);

// Создаем провайдер
export const PermissionsProvider = ({ children }) => {
  const permissions = JSON.parse(localStorage.getItem("userPermissions"));

  const devMode = localStorage.getItem("developer_mode") === "true";

  // console.log(": = : value?.map(row=>row.name_key", permissions?.map(row=>row.name_key));
  return (
    <PermissionsContext.Provider
      value={permissions?.map((row) => row.name_key)}
    >
      {devMode && (
        <div
          style={{
            position: "absolute",
            zIndex: 9999,
            top: 0,
            left: 0,
            fontSize: 16,
            backgroundColor: "rgb(0.1,0.1,0.1,0.01)",
            color: "rgb(0.1,0.1,0.1,0.25)",
          }}
        >
          {permissions?.map((row) => (
            <>
              {row.name_key}
              <br />
            </>
          ))}
        </div>
      )}
      {children}
    </PermissionsContext.Provider>
  );
};

// Хук для использования контекста
export const usePermissions = () => {
  return useContext(PermissionsContext);
};
