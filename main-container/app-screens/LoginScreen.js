/**
 * Login page
 * Use when the user wants to login or go to signup page
 */

import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //To sign in the user it uses firebase authentication
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  };

  /**
   * The rest is for the UI
   * It display the login page with email and password as an input
   * And login and sign up as button
   * If the user click login call signIn function
   * If the user click sign up navigate to the sign up page
   */

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.text}>NEARBY</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.button}>
        <Button title="Login" onPress={signIn} color="#68bb59" />
      </View>
      <View style={styles.button}>
        <Button
          style={styles.button}
          color="#b7d2b6"
          title="Signup"
          onPress={() => navigation.navigate("Signup")}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 250,
    height: 40,
    margin: 6,
    padding: 10,
    borderBottomWidth: 1,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  text: { fontSize: 20, fontWeight: "bold" },
});
