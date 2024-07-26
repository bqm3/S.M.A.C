import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/theme";
import ActionCheckbox from "../Active/ActiveCheckbox";
import Checkbox from "../Checkbox/Checkbox";

const VerticalSelectMul = ({ value,item, index, label, selectedItem, handleSelect }) => {
  const isChecked = selectedItem.includes(value);

  return (
    <View
      style={[
        { backgroundColor: isChecked ? COLORS.bg_button : "white" },
        {
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
          flexDirection: "row",
          gap: 20,
          paddingHorizontal: 80,
        },
      ]}
    >
      <Checkbox onPress={()=>handleSelect(item, index)} isCheck={isChecked} color={"black"}/>
      <Text allowFontScaling={false}
        style={[
          styles.customSelect,
          ({ fontWeight: "600" },
          isChecked
            ? {
                color: COLORS.bg_white,
              }
            : {}),
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default VerticalSelectMul;

const styles = StyleSheet.create({
  customSelect: { fontSize: 15, fontWeight: 700, color: "#637381" },
});
