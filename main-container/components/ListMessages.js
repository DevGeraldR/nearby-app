import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";
import Avatar from "./Avatar";

import { auth, db } from "../firebase/firebase";

export default function ListMessages({ description, user, time, room }) {
  const navigation = useNavigation();
  const [unRead, setUnRead] = useState(true);
  const currentUser = auth.currentUser;

  //To chech if the user read this message
  useEffect(() => {
    if (room.readReceipt.includes(currentUser.email)) {
      setUnRead(false);
    } else {
      setUnRead(true);
    }
  }, [room.readReceipt]);

  return (
    <TouchableOpacity
      style={{ height: 80 }}
      onPress={() => navigation.navigate("message", { user, room })}
    >
      {unRead ? (
        <Grid style={{ maxHeight: 80, backgroundColor: "#b7d2b6" }}>
          <Col
            style={{
              width: 80,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar user={user} size={65} />
          </Col>
          <Col style={{ marginLeft: 10 }}>
            <Row style={{ alignItems: "center" }}>
              <Col>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {user.displayName}
                </Text>
              </Col>
              {time && (
                <Col style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                    {new Date(time.seconds * 1000).toLocaleDateString()}
                  </Text>
                </Col>
              )}
            </Row>
            {description && (
              <Row style={{ marginTop: -5 }}>
                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                  {description}
                </Text>
              </Row>
            )}
          </Col>
        </Grid>
      ) : (
        <Grid style={{ maxHeight: 80 }}>
          <Col
            style={{
              width: 80,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar user={user} size={65} />
          </Col>
          <Col style={{ marginLeft: 10 }}>
            <Row style={{ alignItems: "center" }}>
              <Col>
                <Text style={{ fontWeight: "normal", fontSize: 16 }}>
                  {user.displayName}
                </Text>
              </Col>
              {time && (
                <Col style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 11, fontWeight: "normal" }}>
                    {new Date(time.seconds * 1000).toLocaleDateString()}
                  </Text>
                </Col>
              )}
            </Row>
            {description && (
              <Row style={{ marginTop: -5 }}>
                <Text style={{ fontSize: 13, fontWeight: "normal" }}>
                  {description}
                </Text>
              </Row>
            )}
          </Col>
        </Grid>
      )}
    </TouchableOpacity>
  );
}
