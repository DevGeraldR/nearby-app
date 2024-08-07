/**
 * Display the avatar of the receiver in the header of the message screen
 */

import React from "react";
import { Image } from "react-native";

export default function MessageAvatar({ size, participant }) {
  return (
    <Image
      source={{
        uri: participant.photoURL,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size,
      }}
      resizeMode="cover"
    />
  );
}
