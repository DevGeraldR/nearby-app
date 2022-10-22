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
  const room = route.params.room
    ? route.params.room
    : rooms.find((room) => room.participantsArray.includes(place.adminEmail));

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
        const placeData = {
          displayName: place.displayName, //Place Displayname
          adminName: place.adminName,
          adminEmail: place.adminEmail,
          photoURL: place.photoURL,
        };
        const roomData = {
          participants: [currUserData, placeData],
          participantsArray: [user.email, place.adminEmail],
          readReceipt: [user.email],
        };
        try {
          await setDoc(roomRef, roomData);
        } catch (error) {
          console.log(error);
        }
      } else {
        //To add the current user to the reader Reaciept
        if (!room.readReceipt.includes(user.email)) {
          await updateDoc(roomRef, {
            readReceipt: arrayUnion(user.email),
          });
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

  const sendPushNotification = async () => {
    //To get the other user that will receive the notification, if there is no message then the receiver will be the facility/place
    const receiver = getUserB(room.participants);
    //if sending to a hospital it should be admin name but if customer it is display name
    const receiverName = receiver.adminName
      ? receiver.adminName
      : receiver.displayName;
    //Read the data that match the name of the reciever
    const docRef = doc(db, "Users", receiverName);
    const docSnap = await getDoc(docRef);
    //Send the message
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
    sendPushNotification();
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
