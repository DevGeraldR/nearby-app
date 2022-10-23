/**
 * The header of the message
 */

import { useRoute } from "@react-navigation/native";
import { View, Text } from "react-native";
import Avatar from "./Avatar";

export default function MessageHeader() {
  const route = useRoute();
  const user = route.params.user ? route.params.user : route.params.selected;
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
