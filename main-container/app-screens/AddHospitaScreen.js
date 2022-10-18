import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { StatusBar } from "expo-status-bar";

import * as Location from "expo-location";
import Loading from "../components/Loading";

//TO DO: Verification Proccess
const AddHospitaScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let locations = await Location.getCurrentPositionAsync({});
      setLocation(locations.coords);
    })();
    const user = auth.currentUser;
    if (user) {
      setAdminName(user.displayName);
      setAdminEmail(user.email);
    }
  }, []);

  const addHospital = () => {
    setLoading(true);
    try {
      setDoc(doc(db, "Hospitals", name), {
        adminName: adminName,
        adminEmail: adminEmail,
        displayName: name,
        photoURL: photo,
        street: street,
        city: city,
        province: province,
        contactNumber: contactNumber,
        email: email,
        latitude: location.latitude,
        longitude: location.longitude,
        photoURL:
          photo ||
          "https://cdn.icon-icons.com/icons2/1465/PNG/512/588hospital_100778.png",
      });
      setLoading(false);
      Alert.alert(
        "Displayed Succesfully",
        "You can add more hospital information here."
      );
      navigation.replace("EditHospital");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <KeyboardAvoidingView behaviour='padding' style={styles.container}>
      <StatusBar style='light' />
      {!location ? (
        <Loading />
      ) : (
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              <View>
                <TextInput
                  placeholder='Hospital Name'
                  autoFocus
                  value={name}
                  autofocus
                  onChangeText={(text) => setName(text)}
                  style={styles.inputContainer}
                />
                <TextInput
                  placeholder='Street'
                  value={street}
                  autofocus
                  onChangeText={(text) => setStreet(text)}
                  style={styles.inputContainer}
                />
                <TextInput
                  placeholder='City'
                  value={city}
                  autofocus
                  onChangeText={(text) => setCity(text)}
                  style={styles.inputContainer}
                />
                <TextInput
                  placeholder='Province'
                  value={province}
                  onChangeText={(text) => setProvince(text)}
                  style={styles.inputContainer}
                />
                <TextInput
                  placeholder='Contact Number'
                  value={contactNumber}
                  onChangeText={(text) => setContactNumber(text)}
                  style={styles.inputContainer}
                />
                <TextInput
                  placeholder='Email'
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  style={styles.inputContainer}
                />
              </View>
              <View style={styles.button}>
                <Button
                  title='Display'
                  onPress={addHospital}
                  style={styles.button}
                  color='#68bb59'
                />
              </View>
            </>
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddHospitaScreen;

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
