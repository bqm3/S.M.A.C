import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../constants/adjust";

const ActionCheckboxAll = ({ status,toggleTodo }) => {
  
  return (
    <TouchableOpacity style={styles.box} onPress={() => toggleTodo()}>
      {status && <Entypo name="check" size={adjust(16)} color={COLORS.color_bg} />}
    </TouchableOpacity>
  );
};

export default ActionCheckboxAll;

const styles = StyleSheet.create({
  box: {
    width: adjust(20),
    height: adjust(20),
    borderWidth: 2,
    borderColor: "COLORS.gray",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
