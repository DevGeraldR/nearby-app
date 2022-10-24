/**
 * Apply Admin page
 * Use if the user is not an admin and go to the admin page
 * Accomodate user if wants to apply as an admin
 */

import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";

import { StatusBar } from "expo-status-bar";

const ApplyAdminScreen = () => {
  /**
   * TODO: Apply admin screen
   */

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View>
        <Text>Grow your business with Nearby Ads</Text>
        <Text>Help customers find your business</Text>
      </View>
      <View>
        <Button
          style={styles.button}
          color="#68bb59"
          title="Start Now"
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default ApplyAdminScreen;

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
