// @refresh reset
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
} from "firebase/firestore";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Context } from "../context/Context";
import { useRoute } from "@react-navigation/native";
import { getUserB } from "./MessagesScreen";

const MessageScreen = () => {
  const route = useRoute(Context);
  const randomId = useMemo(() => nanoid(), []);
  const { selectedRoom, rooms } = useContext(Context);
  const [messages, setMessages] = useState([]);
  const user = auth.currentUser;
  const userB = selectedRoom;

  const senderUser = {
    name: user.displayName,
    _id: user.uid,
    avatar: user.photoURL,
  };

  const room = route.params.room;
  const roomId = room ? room.id : randomId;

  const roomRef = doc(db, "rooms", roomId);
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");

  useEffect(() => {
    (async () => {
      if (!room) {
        const currUserData = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        const userBData = {
          displayName: userB.displayName, //Place Displayname
          adminName: userB.adminName,
          adminEmail: userB.adminEmail,
          photoURL: userB.photoURL,
        };
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [user.email, userB.adminEmail],
          readReceipt: [user.email],
        };
        try {
          await setDoc(roomRef, roomData);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, []);

  useEffect(() => {
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
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  const sendPushNotification = async (text) => {
    //To get the other user that will receive the notification
    let receiver, r;
    if (room) {
      //If there is already a room assign to our room
      r = room;
    } else {
      //If there is still no room find a room
      r = rooms.find((room) =>
        room.participantsArray.includes(selectedRoom.adminEmail)
      );
    }
    receiver = getUserB(r.participants);
    //if a hospital it should be admin name but if user it is display name
    const name = receiver.adminName ? receiver.adminName : receiver.displayName;
    //Read the data that match the name of the reciever
    const docRef = doc(db, "Users", name);
    const docSnap = await getDoc(docRef);

    const message = {
      to: docSnap.data().pushToken,
      sound: "default",
      title: user.displayName,
      body: text,
      data: { someData: "goes here" },
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
    sendPushNotification(lastMessage.text);
    await Promise.all(writes);
  }

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
