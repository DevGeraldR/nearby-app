import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";

const Loading = () => {
  return (
    <ActivityIndicator
      size='large'
      color='#00ff00'
      style={styles.loading}
      animating={true}
    />
  );
};

export default Loading;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
  },
});
