/**
 * Home Tab
 * Display after the user loged in
 * Get the rooms in the database for messaging purposes
 * Rooms are where the information of the sender and the reciever store
 * It also register the user for push notication
 */

import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import tw from "twrnc";
import { Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

import { Context } from "../context/Context";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "@firebase/firestore";
import React, { useContext, useEffect, Platform, useRef } from "react";

import * as Notifications from "expo-notifications";

import { StatusBar } from "expo-status-bar";

//Use for notication when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//The data of a screen use to display the icon for navigation
const DATA = [
  {
    id: "1",
    title: "Hospital",
    image:
      "https://cdn.icon-icons.com/icons2/1465/PNG/512/588hospital_100778.png",
    screen: "SearchHospital",
  },
  {
    id: "2",
    title: "Jeepney",
    image:
      "https://toppng.com/public/uploads/thumbnail/jeep-clipart-jeepney-philippine-jeepney-clipart-side-view-11562941562xx1xd61lgj.png",
    screen: "Home",
  },
  {
    id: "3",
    title: "Future Build",
    image:
      "https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/maintenance-512.png",
    screen: "Home",
  },
];

const HomeScreen = () => {
  //For messsaging, reading the rooms collection in database
  const navigation = useNavigation();
  const user = auth.currentUser;
  const { rooms, setRooms, setBadgeCounter } = useContext(Context);

  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", user.email)
  );

  //For push notification
  const responseListener = useRef();
  useEffect(() => {
    //To register the user for push notication
    registerForPushNotificationsAsync(user);

    //Use to navigate the user to the Messages screen if the user click the notification.
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {
        navigation.navigate("Messages");
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //Use to get all the Rooms, for messaging purpose.
  useEffect(() => {
    //To get all the Rooms in the database
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //To filter the rooms, get only the rooms where the user has last message
      setRooms(parsedChats.filter((doc) => doc.lastMessage));
    });

    return () => unsubscribe();
  }, []);

  //To count the unread messages
  useEffect(() => {
    let counter = 0;
    rooms.some((room) => {
      if (!room.readReceipt.includes(user.email)) {
        counter += 1;
      }
    });
    setBadgeCounter(counter);
  }, [rooms]);

  /**
   * This return the UI
   * Where the icons were display and navigate the user to
   * the certain page if the user interacts with the icon
   */

  return (
    <SafeAreaView>
      <StatusBar style="light" />
      <View>
        <FlatList
          data={DATA}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(item.screen);
              }}
              style={tw`p-2 pl-6 pb-4 pt-4 bg-gray-200 m-2 w-40`}
            >
              <View>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 120,
                    height: 120,
                    resizeMode: "contain",
                  }}
                />
                <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
                <Icon
                  style={tw`p-2 bg-black rounded-full w-10 mt-2`}
                  round
                  name="arrowright"
                  color="white"
                  type="antdesign"
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

//Use to Register the user for push notication
//This was callled first at the top
const registerForPushNotificationsAsync = async (user) => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform?.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const userRef = doc(db, "Users", user.displayName);
  await updateDoc(userRef, {
    pushToken: token,
  });
};

export default HomeScreen;
