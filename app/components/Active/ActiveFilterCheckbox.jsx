import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../constants/adjust";

const ActionFilterCheckbox = ({ handleCheckbox, name, filters, size }) => {
 
  return (
    <TouchableOpacity style={[styles.box, {width: size ? adjust(size +5) : adjust(20), height: size ? adjust(height+5) : adjust(20)}]} onPress={() => handleCheckbox(name,!filters)}>
      {filters && <Entypo name="check" size={size ? adjust(size): adjust(16)} color={COLORS.color_bg} />}
    </TouchableOpacity>
  );
};

export default ActionFilterCheckbox;

const styles = StyleSheet.create({
  box: {
    width: adjust(20),
    height: adjust(20),
    borderWidth: 1.5,
    borderColor: COLORS.gray,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
