/**
 * Profile Tab
 * Use do display and edit profile of the user
 * And also to logout
 */

import { StyleSheet, View, Button } from "react-native";
import React, { useContext } from "react";
import { auth } from "../firebase/firebase";
import { Context } from "../context/Context";

import { StatusBar } from "expo-status-bar";

const ProfileScreen = () => {
  /**
   * TODO: Profile page
   */
  const { setIsLoged, setRooms } = useContext(Context);
  //To sign out the user
  const signOut = () => {
    setRooms([]);
    auth.signOut().then(() => {
      setIsLoged(false);
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.button}>
        <Button title="Sign Out" onPress={signOut} color="#68bb59" />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
