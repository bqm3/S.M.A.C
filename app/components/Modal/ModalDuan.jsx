import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../../constants/theme";
import ButtonChecklist from "../Button/ButtonCheckList";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalDuan = ({
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  loadingSubmit,
}) => {

  const [duan, setDuan] = useState(dataInput?.Duan)

  return (
    <View style={{ margin: 20 }}>
      <View style={{ justifyContent: "space-around", width: "100%" }}>
        <Text allowFontScaling={false}   style={styles.text}>Tên dự án</Text>
        <TextInput allowFontScaling={false}  
          value={duan}
          placeholder="Nhập tên dự án thực hiện checklist"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => {
            handleChangeText("Duan", val)
            setDuan(val)
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <ButtonSubmit
          text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
          width={"auto"}
          backgroundColor={COLORS.bg_button}
          color={"white"}
          isLoading={loadingSubmit}
          onPress={
            isCheckUpdate.check
              ? () => handlePushDataEdit(isCheckUpdate.ID_Duan)
              : () => handlePushDataSave()
          }
        />
      </View>
    </View>
  );
};

export default ModalDuan;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    height: 48,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  head: {
    backgroundColor: COLORS.bg_main,
    // height: 30
  },
  headText: {
    textAlign: "center",
    color: COLORS.text_main,
  },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
    zIndex: 1,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
