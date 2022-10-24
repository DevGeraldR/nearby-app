/**
 * Messages Tab
 * Use to display the list of messages
 */

import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Context } from "../context/Context";
import { auth } from "../firebase/firebase";
import tw from "twrnc";
import ListMessages from "../components/ListMessages";

import { StatusBar } from "expo-status-bar";

export default function MessagesScreen() {
  const { rooms } = useContext(Context);

  return (
    <>
      <StatusBar style="light" />
      {rooms.length > 0 ? (
        //Display the messages sort first before map to display it as sorted by
        <View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
          {rooms
            .sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt)
            .map((room) => (
              <ListMessages
                description={room.lastMessage.text}
                key={room.id}
                room={room}
                time={room.lastMessage.createdAt}
                user={getUserB(room.participants)}
              />
            ))}
        </View>
      ) : (
        <View style={tw`p-5`}>
          <Text style={tw`text-center text-lg `}>No Message</Text>
        </View>
      )}
    </>
  );
}

//Delete the Current user to the participants to get the userB or the reciever
//Export this to use in sending push notification
export const getUserB = (users) => {
  const user = auth.currentUser;
  const newUsers = { ...users };
  //Delete all the information that much the current user to get the other user.
  if (user.email == newUsers[0].email) {
    delete newUsers[0];
  } else {
    delete newUsers[1];
  }
  const [id, participant] = Object.entries(newUsers).flat();
  return { id, ...participant };
};
