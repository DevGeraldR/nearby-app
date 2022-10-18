import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminToolsScreen from "../app-screens/AdminToolsScreen";
import AddHospitaScreen from "../app-screens/AddHospitaScreen";
import EditHospitalScreen from "../app-screens/EditHospitalScreen";
import HomeScreen from "../app-screens/HomeScreen";
import SearchHospitalScreen from "../app-screens/SearchHospitalScreen";
import MessageScreen from "../app-screens/MessageScreen";
import ProfileScreen from "../app-screens/ProfileScreen";
import TabNav from "./TabNav";
import MessageHeader from "../components/MessageHeader";

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
        name='TabNav'
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='AdminTools'
        component={AdminToolsScreen}
        options={{
          title: "Edit Icon",
        }}
      />
      <Stack.Screen
        name='AddHospital'
        options={{
          title: "Hospital Information",
        }}
        component={AddHospitaScreen}
      />
      <Stack.Screen
        name='EditHospital'
        component={EditHospitalScreen}
        options={{
          title: "Edit My Hospital",
        }}
      />
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          contentStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name='SearchHospital'
        component={SearchHospitalScreen}
        options={{
          title: "Nearby Hospital",
        }}
      />
      <Stack.Screen
        name='message'
        component={MessageScreen}
        options={{ headerTitle: (props) => <MessageHeader {...props} /> }}
      />
      <Stack.Screen name='Messages' component={MessageScreen} />
      <Stack.Screen
        name='profile'
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
