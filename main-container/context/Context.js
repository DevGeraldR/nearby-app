/**
 * This is use for our useContext hook
 * To declare and use a variable globally
 */

import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  //Variable to check if the user is already loged in
  const [isLoged, setIsLoged] = useState(false);
  //Variable for messaging it store the information of the reciever and the sender
  const [rooms, setRooms] = useState([]);
  //Variable to store the number of unread messages
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
