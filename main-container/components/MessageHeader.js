import { useRoute } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Context } from "../context/Context";
import Avatar from "./Avatar";

export default function MessageHeader() {
  const route = useRoute();
  const { selectedRoom } = useContext(Context);
  const user = route.params.user ? route.params.user : selectedRoom;
  return (
    <View style={{ flexDirection: "row", marginLeft: -70 }}>
      <View>
        <Avatar size={40} user={user} />
      </View>
      <View
        style={{
          marginLeft: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{user.displayName}</Text>
      </View>
    </View>
  );
}
