import React from "react";
import { Image } from "react-native";

export default function Avatar({ size, user }) {
  return (
    <Image
      source={{
        uri: user.photoURL,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size,
      }}
      resizeMode='cover'
    />
  );
}
