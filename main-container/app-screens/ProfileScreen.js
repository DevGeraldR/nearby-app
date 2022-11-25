/**
 * Profile Tab
 * Use do display and edit profile of the user
 * And also to logout
 */

import { StyleSheet, View, Button, Image, Text } from "react-native";
import React, { useContext } from "react";
import { auth } from "../firebase/firebase";
import { Context } from "../context/Context";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";

const ProfileScreen = () => {
  const user = auth.currentUser;
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
      <View style={tw`items-center`}>
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 160, height: 160, resizeMode: "contain" }}
        ></Image>
        <Text style={tw`p-5 text-base`}>{user.displayName}</Text>
      </View>

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
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
