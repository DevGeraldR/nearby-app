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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
  //For messsaging, reading the rooms firebase
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
    registerForPushNotificationsAsync(user);

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {
        navigation.navigate("Messages");
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
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

  return (
    <SafeAreaView>
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
