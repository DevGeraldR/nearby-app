import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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

const SearchHospitalScreen = ({ navigation }) => {
  const [filteredList, setFilteredList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { rooms } = useContext(Context);
  const [selected, setSelected] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "Hospitals"));
      const hospitals = [];
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
        hospitals.push({
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
      const filteredLists = [];
      {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLatitude(location.coords.latitude);
        setUserLongitude(location.coords.longitude);

        Object.values(hospitals).map((values) => {
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
      filteredLists.sort((a, b) => a.distance - b.distance);
      setFilteredList(filteredLists);
      setLoading(false);
    }
    fetchData();
  }, []);

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

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
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
                style={tw`flex-row justify-between items-center pr-2 ${
                  item.id === selected?.id ? "bg-gray-200" : " "
                }`}
              >
                <View>
                  <Image
                    source={{ uri: item.photoURL }}
                    style={{
                      width: 100,
                      height: 100,
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View style={tw`-ml-6`}>
                  <Text style={tw`text-lg font-bold`}>{item.displayName}</Text>
                  <Text>
                    {item.street} {item.city} {item.province}
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
        <View style={tw`justify-between`}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditHospital");
            }}
            disabled={!selected}
            style={tw`flex-row bg-[#b7d2b6] py-1 m-0.9 ${
              selected ? null : "bg-gray-300"
            }`}
          >
            <AntDesign style={tw`pl-1`} name="form" size={30} color="black" />
            <Text style={tw` text-lg text-center`}>Edit My Hospital</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchHospitalScreen;

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
