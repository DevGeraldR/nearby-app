/**
 * Search Place Page
 * Display the nearest Place
 * Display search bar if the user wants to find specific Place
 * Display location and message button if a user selected a Place
 * Redirect the user to the google map if the user click location button
 * Redirect the user to the message screen if the user click message button
 */

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { FlatList } from "react-native-gesture-handler";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import Loading from "../components/Loading";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import { Context } from "../context/Context";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const SearchPlaceScreen = ({ navigation }) => {
  const route = useRoute(Context);
  const [filteredList, setFilteredList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const user = auth.currentUser;

  // route.params contain the title of the selected place from the home screen
  const placeName = route.params;

  useEffect(() => {
    //To get and store the list of place from our database to the variables.
    async function fetchData() {
      // This will fetch the data base on the place Name
      const querySnapshot = await getDocs(collection(db, placeName));
      const place = [];
      querySnapshot.forEach((doc) => {
        const {
          displayName,
          adminName,
          adminEmail,
          street,
          city,
          province,
          email,
          contactNumber,
          photoURL,
          longitude,
          latitude,
        } = doc.data();
        place.push({
          id: doc.id,
          displayName,
          adminName,
          adminEmail,
          street,
          city,
          province,
          email,
          contactNumber,
          photoURL,
          latitude,
          longitude,
        });
      });
      //To filter and get the nearest place to the user.
      const filteredLists = [];
      {
        //To ask for permession to get the user current location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        //To get the user location
        let location = await Location.getCurrentPositionAsync({});
        setUserLatitude(location.coords.latitude);
        setUserLongitude(location.coords.longitude);

        //To get the list of the nearest place to the user
        Object.values(place).map((values) => {
          let distance = getDistance(
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            { latitude: values.latitude, longitude: values.longitude }
          );

          if (distance < 20000) {
            filteredLists.push({ ...values, distance: distance });
          }
        });
      }
      //To sort the list of the nearest place from the nearest.
      filteredLists.sort((a, b) => a.distance - b.distance);
      setFilteredList(filteredLists);
      //To stop the loading
      setLoading(false);
    }
    fetchData();
  }, []);

  //Use when the user search a place to the search bar
  //The user so far can search the name of a place or a address.
  const searchFilterFunction = (text) => {
    if (text) {
      const newData = filteredList.filter(function (item) {
        const location =
          item.street + item.city + item.province + item.displayName;
        const itemData = location ? location : "";
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchList(newData);
      setSearch(text);
    } else {
      setSearchList(filteredList);
      setSearch(text);
    }
  };

  /**
   * The rest is for the UI
   * It First check if the loading is done
   * Loading is implemented while getting the user location
   * and fetching the nearest place
   * Then it display the nearest place and
   * the location and message button
   * will appear after a user selected a place
   * And the said functionality at the top will be applied
   */

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <StatusBar style="light" />
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => {
          searchFilterFunction(text);
          setSelected(false);
        }}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
        editable={!loading}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={!search ? filteredList : searchList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelected(item);
                }}
                style={tw`flex-row justify-between items-center pl-2 pr-2 pt-4 pb-4 ${
                  item.id === selected?.id ? "bg-gray-200" : " "
                }`}
              >
                <View>
                  <Image
                    source={{ uri: item.photoURL }}
                    style={{
                      width: 65,
                      height: 65,
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={tw`-ml-6 max-w-45`}>
                  <Text style={tw`text-lg font-bold`}>{item.displayName}</Text>
                  <Text>
                    {item.street}, {item.city}, {item.province}
                  </Text>
                </View>
                <View>
                  <Text>Open</Text>
                  <Text>{item.distance / 1000}km</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      {selected?.adminName != user.displayName ? (
        <View style={tw`justify-between`}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                "http://maps.google.com/maps?saddr=" +
                  userLatitude +
                  "+" +
                  userLongitude +
                  "&daddr=" +
                  selected.latitude +
                  "+" +
                  selected.longitude +
                  "&dirflg=d"
              );
            }}
            disabled={!selected}
            style={tw`flex-row bg-[#b7d2b6] py-1 m-0.9 ${
              selected ? null : "bg-gray-300"
            }`}
          >
            <EvilIcons name="location" size={40} color="red" />
            <Text style={tw` text-lg`}>{selected?.displayName} Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("message", { selected })}
            disabled={!selected}
            style={tw`flex-row bg-[#b7d2b6] py-1 m-0.9 ${
              selected ? null : "bg-gray-300"
            }`}
          >
            <AntDesign
              style={tw`pl-1`}
              name="profile"
              size={30}
              color="black"
            />
            <Text style={tw` text-lg`}> Message {selected?.displayName}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={tw`flex flex-row bg-[#b7d2b6] py-1 m-0.9`}>
          <AntDesign style={tw`pl-1`} name="form" size={30} color="black" />
          <Text style={tw`pl-2 text-lg`}>Your Added Place</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchPlaceScreen;

const styles = StyleSheet.create({
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#68bb59",
    backgroundColor: "#FFFFFF",
  },
});
