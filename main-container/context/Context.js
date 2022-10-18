import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [badgeCounter, setBadgeCounter] = useState(null);

  return (
    <Context.Provider
      value={{
        isLoged,
        setIsLoged,
        rooms,
        setRooms,
        selectedRoom,
        setSelectedRoom,
        badgeCounter,
        setBadgeCounter,
      }}
    >
      {children}
    </Context.Provider>
  );
};
