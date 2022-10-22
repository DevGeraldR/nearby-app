import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [badgeCounter, setBadgeCounter] = useState(null);

  return (
    <Context.Provider
      value={{
        isLoged,
        setIsLoged,
        rooms,
        setRooms,
        badgeCounter,
        setBadgeCounter,
      }}
    >
      {children}
    </Context.Provider>
  );
};
