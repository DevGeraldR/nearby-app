import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";

const ApplyAdminScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text>Grow your business with Nearby Ads</Text>
        <Text>Help customers find your business</Text>
      </View>
      <View>
        <Button
          style={styles.button}
          color='#68bb59'
          title='Start Now'
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
