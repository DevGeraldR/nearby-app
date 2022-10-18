import { StyleSheet, View, Button, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Loading from "../components/Loading";
import ApplyAdminScreen from "./ApplyAdminScreen";

const AdminToolsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "Users"), where("admin", "==", true));
      const querySnapshot = await getDocs(q);
      const admins = [];
      querySnapshot.forEach((doc) => {
        const { name, email } = doc.data();
        admins.push({ name, email });
      });

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
      setLoading(false);
    })();
  }, []);

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
                  title='Add Hospital'
                  onPress={() => {
                    navigation.navigate("AddHospital");
                  }}
                  color='#68bb59'
                />
              </View>
              <View style={styles.button}>
                <Button
                  title='Edit My Hospital'
                  onPress={() => {
                    navigation.navigate("EditHospital");
                  }}
                  color='#b7d2b6'
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
