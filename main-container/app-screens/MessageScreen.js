/**
 * Message page
 * Where the messaging happen
 */

// @refresh reset
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, db } from "../firebase/firebase";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Context } from "../context/Context";
import { useRoute } from "@react-navigation/native";
import { getUserB } from "./MessagesScreen";

const MessageScreen = () => {
  const route = useRoute(Context);
  const randomId = useMemo(() => nanoid(), []);
  const { rooms } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const user = auth.currentUser;
  const place = route.params.selected;

  const senderUser = {
    name: user.displayName,
    _id: user.uid,
    avatar: user.photoURL,
  };

  //To get the room
  //If the user comes from the Messages screen the route.params.room will be use
  //Because in our Messages we have their the room that we use to display all the messages.
  //If the user comes from the search hospital where they can start a
  //message with the hospital the progran needs to search first the rooms to check if they
  //already have. It is use to redirect the user from their older message if they already have.
  const room = route.params.room
    ? route.params.room
    : rooms.find((room) => room.participantsArray.includes(place.adminEmail));

  //To get the room id
  //Check if already have a room
  //If already have a room then use the room id if not then generate a random id
  const roomId = room ? room.id : randomId;

  const roomRef = doc(db, "rooms", roomId);
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");

  //To create room and add it to our database in Rooms collection
  useEffect(() => {
    (async () => {
      if (!room) {
        const currUserData = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        const placeData = {
          displayName: place.displayName,
          adminName: place.adminName,
          adminEmail: place.adminEmail,
          photoURL: place.photoURL,
        };
        const roomData = {
          participants: [currUserData, placeData],
          participantsArray: [user.email, place.adminEmail],
          // Read receipt is use to decide whether the user already read the message
          //It store the email of the user who opened the message
          readReceipt: [user.email],
        };
        //Send the data to the database
        try {
          await setDoc(roomRef, roomData);
        } catch (error) {
          console.log(error);
        }
      } else {
        //If already have a room and the user open a message
        //add the current user to the reader Reaciept
        if (!room.readReceipt.includes(user.email)) {
          await updateDoc(roomRef, {
            readReceipt: arrayUnion(user.email),
          });
        }
      }
    })();
  }, []);

  //Use to check if there is a changes in our messages and update it
  //If there is a  new message add in our database
  //Get that message and display it to the user
  useEffect(() => {
    //Use to listen to the database and get the new message
    const unsubscribe = onSnapshot(roomMessagesRef, (querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();
          return {
            ...message,
            createdAt: message.createdAt.toDate(),
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      //Call the function that displays the message
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  const sendPushNotification = async () => {
    //To get the other user that will receive the notification, if there is no room/message
    //then the receiver will be the facility/place
    const receiver = !room ? place : getUserB(room.participants);
    //if sending to a hospital it should be admin name but if customer it is display name
    const receiverName = receiver.adminName
      ? receiver.adminName
      : receiver.displayName;
    //To read the data of the user that match the name of the reciever
    const docRef = doc(db, "Users", receiverName);
    const docSnap = await getDoc(docRef);
    //To send the message
    const message = {
      to: docSnap.data().pushToken,
      sound: "default",
      title: "You have a new message",
      body: "",
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  //Use to display the new message to the user
  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  async function onSend(messages = []) {
    //To delete the other user from readReceipt after sending message
    const userB =
      room?.readReceipt[0] === user.email
        ? room?.readReceipt[1]
        : room?.readReceipt[0];

    const writes = messages.map((m) => addDoc(roomMessagesRef, m));
    const lastMessage = messages[messages.length - 1];
    writes.push(
      updateDoc(roomRef, {
        lastMessage,
        readReceipt: arrayRemove(userB ? userB : " "),
      })
    );
    //To send notification to the receiver
    sendPushNotification();
    await Promise.all(writes);
  }

  /**
   * The rest is for the UI
   * We use gifted chat library to display the messages
   */

  return (
    <GiftedChat
      onSend={onSend}
      messages={messages}
      user={senderUser}
      renderAvatar={null}
      timeTextStyle={{ right: { color: "gray" } }}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={{
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 2,
            borderRadius: 20,
          }}
        />
      )}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: "#b7d2b6",
            },
            right: {
              backgroundColor: "#68bb59",
            },
          }}
        />
      )}
    />
  );
};

export default MessageScreen;
