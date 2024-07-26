import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../constants/adjust";

const Checkbox = ({ isCheck, onPress, color, size }) => {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          borderColor: color ? color : "white",
          width: size ? adjust(30) : adjust(24),
          height: size ? adjust(30) : adjust(24),
        },
      ]}
      onPress={onPress}
    >
      {isCheck && (
        <Entypo
          name="check"
          size={adjust(size ? size * 0.9 : 20)}
          color={color ? color : "white"}
        />
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  box: {
    width: adjust(24),
    height: adjust(24),
    borderWidth: 2,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
