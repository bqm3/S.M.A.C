import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import adjust from "../../constants/adjust";

const ButtonScan = ({
  loading,
  text,
  onPress,
  color,
  backgroundColor,
  icon,
  width,
}) => {
  return (
    <TouchableOpacity
      style={{
        width: width ? width : "auto",
        backgroundColor: backgroundColor,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 8,
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
        {loading && (
          <ActivityIndicator
            style={
              {
                // marginRight: 4,
              }
            }
            size="small"
            color={"white"}
          />
        )}
        {icon}
        <Text
          allowFontScaling={false}
          style={{
            color: color,
            fontSize: adjust(15),
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {text ? text : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonScan;
