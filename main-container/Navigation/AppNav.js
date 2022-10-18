import AuthNav from "./AuthNav";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Context } from "../context/Context";
import MainNav from "./MainNav";

const AppNav = () => {
  const { isLoged, setIsLoged } = useContext(Context);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoged(true);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaProvider>{isLoged ? <MainNav /> : <AuthNav />}</SafeAreaProvider>
    </NavigationContainer>
  );
};

export default AppNav;
