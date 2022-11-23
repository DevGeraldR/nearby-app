/**
 * Use for Main navigation.
 * Navigation after the user loged in
 * Declare here all the screen for main navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../app-screens/HomeScreen";
import SearchPlaceScreen from "../app-screens/SearchPlaceScreen";
import MessageScreen from "../app-screens/MessageScreen";
import ProfileScreen from "../app-screens/ProfileScreen";
import TabNav from "./TabNav";
import MessageHeader from "../components/MessageHeader";
import AddPlaceScreen from "../app-screens/AddPlaceScreen";

const Stack = createNativeStackNavigator();

const MainNav = () => {
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
        name="TabNav"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="searchPlace"
        component={SearchPlaceScreen}
        options={{
          title: "Nearby Place",
        }}
      />
      <Stack.Screen
        name="message"
        component={MessageScreen}
        options={{ headerTitle: (props) => <MessageHeader {...props} /> }}
      />
      <Stack.Screen name="Messages" component={MessageScreen} />
      <Stack.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="addplace"
        options={{
          title: "Add Place",
        }}
        component={AddPlaceScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
