import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import adjust from "../../constants/adjust";

const ActionCheckbox = ({ newActionCheckList, item, handleToggle, size }) => {
  let isExistIndex;
  if (newActionCheckList) {
    isExistIndex = newActionCheckList.find(
      (existingItem) => existingItem?.ID_Checklist === item?.ID_Checklist
    );
  } else {
    isExistIndex = false; // Choose an appropriate fallback value
  }

  return (
    <TouchableOpacity
      style={[styles.box, { width: size, height: size }]}
      onPress={() => (handleToggle ? handleToggle(item) : {})}
    >
      {isExistIndex && (
        <Entypo name="check" size={adjust(16)} color={COLORS.color_bg} />
      )}
    </TouchableOpacity>
  );
};

export default ActionCheckbox;

const styles = StyleSheet.create({
  box: {
    width: adjust(20),
    height: adjust(20),
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
