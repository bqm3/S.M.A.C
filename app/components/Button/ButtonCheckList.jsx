import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TouchableNativeFeedback
} from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import adjust from "../../constants/adjust";

const ButtonChecklist = ({ text, onPress, color, marginLeft, icon }) => {
  return (
    <>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          style={{
            width: "auto",
            backgroundColor: color ? color : COLORS.bg_main,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            borderRadius: 8,
            marginLeft: marginLeft ? marginLeft : 0,
            borderColor: COLORS.bg_button,
            borderWidth: 1,
          }}
          onPress={onPress}
        >
          <View
            style={{
              padding: 16,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontSize: adjust(15),
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {text ? text : ""}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={{
              width: "auto",
              backgroundColor: color ? color : COLORS.bg_main,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              borderRadius: 8,
              marginLeft: marginLeft ? marginLeft : 0,
              borderColor: COLORS.bg_button,
              borderWidth: 1,
            }}
            onPress={onPress}
          >
            <View
              style={{
                padding: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {icon}
              <Text
                allowFontScaling={false}
                style={{
                  color: "white",
                  fontSize: adjust(15),
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {text ? text : ""}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default ButtonChecklist;
