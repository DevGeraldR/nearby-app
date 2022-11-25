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
    title: "Facility",
    places: [
      {
        id: "1.1",
        title: "Hospital",
        image:
          "https://cdn.icon-icons.com/icons2/1465/PNG/512/588hospital_100778.png",
      },
      {
        id: "1.2",
        title: "Gym",
        image: "http://cdn.onlinewebfonts.com/svg/img_557766.png",
      },
      {
        id: "1.3",
        title: "Clinic",
        image: "https://cdn-icons-png.flaticon.com/512/3140/3140365.png",
      },
      {
        id: "1.4",
        title: "Vet",
        image: "https://cdn-icons-png.flaticon.com/512/2138/2138473.png",
      },
    ],
  },
  {
    id: "2",
    title: "Transfortation",
    places: [
      {
        id: "2.1",
        title: "Taxi",
        image: "https://cdn-icons-png.flaticon.com/512/171/171241.png",
      },
      {
        id: "2.2",
        title: "Jeep",
        image:
          "https://toppng.com/public/uploads/thumbnail/jeep-clipart-jeepney-philippine-jeepney-clipart-side-view-11562941562xx1xd61lgj.png",
      },
      {
        id: "2.3",
        title: "Bus",
        image: "https://cdn-icons-png.flaticon.com/512/5030/5030991.png",
      },
    ],
  },
  {
    id: "3",
    title: "Food",
    places: [
      {
        id: "3.1",
        title: "Restaurant",
        image:
          "https://cdn.pixabay.com/photo/2021/05/25/02/03/restaurant-6281067_1280.png",
      },
      {
        id: "3.2",
        title: "Fast Food",
        image: "https://cdn-icons-png.flaticon.com/512/3703/3703377.png",
      },
      {
        id: "3.3",
        title: "Lomihan",
        image: "https://cdn-icons-png.flaticon.com/512/3041/3041130.png",
      },
      {
        id: "3.4",
        title: "Pancitan",
        image: "https://cdn-icons-png.flaticon.com/512/1471/1471262.png",
      },
    ],
  },
  {
    id: "4",
    title: "Water Bender",
    places: [
      {
        id: "4.1",
        title: "Yelo",
        image:
          "https://icons-for-free.com/iconfiles/png/512/cold+ice+snow+snowflake+winter+icon-1320167737619506347.png",
      },
      {
        id: "4.2",
        title: "Ice Tubig",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Icon-water-blue.svg/1200px-Icon-water-blue.svg.png",
      },
      {
        id: "4.3",
        title: "Ice Cube",
        image: "https://cdn-icons-png.flaticon.com/512/2458/2458132.png",
      },
    ],
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`pb-5`}>
              <Text style={tw`pl-2`}>{item.title}</Text>
              <FlatList
                data={item.places}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("searchPlace", item.title);
                    }}
                    style={tw`p-2 pl-5 pb-4 pt-4 bg-[#ddead1] m-2 w-30`}
                  >
                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: 80,
                          height: 80,
                          resizeMode: "contain",
                        }}
                      />
                      <Text style={tw`mt-2 text-lg font-semibold`}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
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
  const token = (
    await Notifications.getExpoPushTokenAsync({
      experienceId: "@goodman_22/nearby",
    })
  ).data;

  if (Platform?.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const userRef = doc(db, "Users", user.email);
  await updateDoc(userRef, {
    pushToken: token,
  });
};

export default HomeScreen;
