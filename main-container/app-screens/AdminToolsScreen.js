/**
 * Admin Tab
 * It is use if the admin wants to edit or add a place
 */

import { StyleSheet, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Loading from "../components/Loading";
import ApplyAdminScreen from "./ApplyAdminScreen";

const AdminToolsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    //To get all the admins
    (async () => {
      const q = query(collection(db, "Users"), where("admin", "==", true));
      const querySnapshot = await getDocs(q);
      const admins = [];
      querySnapshot.forEach((doc) => {
        const { name, email } = doc.data();
        admins.push({ name, email });
      });
      //To check if the current user is an admin
      const isAdmin = admins.some((element) => {
        const user = auth.currentUser;
        if (
          user.displayName.toUpperCase() === element.name.toUpperCase() &&
          user.email.toUpperCase() === element.email.toUpperCase()
        ) {
          return true;
        }
        return false;
      });

      if (isAdmin) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
      //To end the loading
      setLoading(false);
    })();
  }, []);

  /**
   * The rest are for the UI
   * Display loading, loading is display while checking if the curent user is an admin
   * If the curent user is an admin display admin page else ask the user to register
   * for an admin
   */

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {admin ? (
            <View style={styles.container}>
              <View style={styles.button}>
                <Button
                  title="Add Hospital"
                  onPress={() => {
                    navigation.navigate("AddHospital");
                  }}
                  color="#68bb59"
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="Edit My Hospital"
                  onPress={() => {
                    navigation.navigate("EditHospital");
                  }}
                  color="#b7d2b6"
                />
              </View>
            </View>
          ) : (
            <ApplyAdminScreen />
          )}
        </>
      )}
    </>
  );
};

export default AdminToolsScreen;

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
