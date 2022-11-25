/**
 * Use for app navigation
 * It decided wether to navigate the user to
 * the login page or to the home screen
 */

import AuthNav from "./AuthNav";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Context } from "../context/Context";
import MainNav from "./MainNav";
import Loading from "../components/Loading";

const AppNav = () => {
  const { isLoged, setIsLoged } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  //Listen to the changes in the firebase authentication.
  //To check if a user is loged in or already loged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoged(true);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <SafeAreaProvider>{isLoged ? <MainNav /> : <AuthNav />}</SafeAreaProvider>
    </NavigationContainer>
  );
};

export default AppNav;
