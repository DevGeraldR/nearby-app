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
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");

  const SignupUser = () => {
    //To create the new user in our firebase authentication
    //Then update the user data to save the user photoURL
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        //-----------------------------NOTE-----------------------------
        //I use the syntax below to solve the bug that the user photo doesn't display after
        //login in the home screen but i remove it for now since i am not displaying user
        //photo in the hompage anymore.
        //_____________SYNTAX_____________//
        // user.displayName = name;
        // user.photoURL =
        //   photo ||
        //   "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png";
        //________________________________
        //Don't delete this for future use.
        //--------------------------------------------------------------
        updateProfile(user, {
          displayName: name,
          photoURL:
            photo ||
            "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
        }).catch((error) => {
          alert(error.message);
        });
        //To send the user information in our database
        try {
          setDoc(doc(db, "Users", name), {
            name: name,
            street: street,
            city: city,
            province: province,
            contactNumber: contactNumber,
            email: email,
            admin: false,
            photoURL:
              photo ||
              "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
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
          placeholder="Steet"
          value={street}
          autofocus
          onChangeText={(text) => setStreet(text)}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="City"
          value={city}
          autofocus
          onChangeText={(text) => setCity(text)}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Province"
          value={province}
          onChangeText={(text) => setProvince(text)}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={(text) => setContactNumber(text)}
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
          value={password}
          onChangeText={(text) => setPassword(text)}
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
