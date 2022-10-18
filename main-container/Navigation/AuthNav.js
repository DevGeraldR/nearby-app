import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../app-screens/LoginScreen";
import SignupScreen from "../app-screens/SignupScreen";

const Stack = createNativeStackNavigator();

const AuthNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#68bb59" },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ddead1" },
        }}
      />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNav;
