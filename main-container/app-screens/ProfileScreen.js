import { StyleSheet, Text, View, Button } from "react-native";
import React, { useContext } from "react";
import { auth } from "../firebase/firebase";
import { Context } from "../context/Context";

const ProfileScreen = () => {
  const { setIsLoged, setRooms } = useContext(Context);
  const signOut = () => {
    setRooms([]);
    auth.signOut().then(() => {
      setIsLoged(false);
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title='Sign Out' onPress={signOut} color='#68bb59' />
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
