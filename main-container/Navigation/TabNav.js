/**
 * Use for Tab navigation
 * When the user interact with the tab bar
 */

import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../app-screens/HomeScreen";
import ProfileScreen from "../app-screens/ProfileScreen";
import AdminToolsScreen from "../app-screens/AdminToolsScreen";
import MessagesScreen from "../app-screens/MessagesScreen";
import { Context } from "../context/Context";

const Tab = createBottomTabNavigator();

const TabNav = () => {
  const { badgeCounter } = useContext(Context);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          //To change the design of the icon when the user clicked it
          if (rn === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === "Add Place") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (rn === "Messages") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (rn === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: "#68bb59",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 70 },
        headerStyle: { backgroundColor: "#68bb59" },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen
        name="Home"
        optioin={{ title: "Home" }}
        component={HomeScreen}
      />
      <Tab.Screen name="Add Place" component={AdminToolsScreen} />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        //To display the number of unread messages in the message icon
        options={{ tabBarBadge: badgeCounter !== 0 ? badgeCounter : null }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNav;
