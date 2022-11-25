/**
 * Signup page
 * It use firebase authentication
 */

import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TextInput,
  Button,
} from "react-native";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState("");

  const SignupUser = () => {
    //To not create a user if passwords don't match
    if (password !== confirmPassword) {
      alert("Password Don't Match");
      return;
    }
    //To create the new user in our firebase authentication
    //Then update the user data to save the user photoURL
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        updateProfile(user, {
          displayName: name,
          photoURL:
            photo || "https://cdn.fashiola.in/images/profiel_avatar.png",
        }).catch((error) => {
          alert(error.message);
        });
        //To send the user information in our database
        try {
          setDoc(doc(db, "Users", email), {
            name: name,
            email: email,
            role: "user",
            photoURL:
              photo || "https://cdn.fashiola.in/images/profiel_avatar.png",
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  /**
   * The rest is for the UI
   * It displays a input box for the user to input their information
   * And also signup button for the user to be able to signup
   * and navigate the user to the home tab
   */

  return (
    <KeyboardAvoidingView behaviour="padding" style={styles.container}>
      <StatusBar style="light" />
      <View>
        <TextInput
          placeholder="Full Name"
          autoFocus
          value={name}
          autofocus
          onChangeText={(text) => setName(text)}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Confirm Password"
          type="password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          style={styles.inputContainer}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Signup"
          onPress={SignupUser}
          style={styles.button}
          color="#68bb59"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

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
  button: { width: 200, marginTop: 10 },
});
