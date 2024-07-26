import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef } from "react";
// import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalChecklistC = ({
  ent_giamsat,
  ent_calv,
  dataInput,
  handleChangeText,
  handlePushDataSave,
  isLoading,
}) => {
  const ref = useRef(null);
  // const defaultCalv = ent_calv?.find(
  //   (calv) => calv.ID_Calv === dataInput?.Calv?.ID_Calv
  // );
  // const defaultGiamsat = ent_giamsat?.find(
  //   (Giamsat) =>
  //     Giamsat.ID_Giamsat !== null && Giamsat.ID_Giamsat === dataInput.ID_Giamsat
  // );

  // const ent_giamsat =[
  //   {
  //     "Gioitinh": "nam",
  //     "Hoten": "gs làm sạch",
  //     "ID_Chucvu": 2,
  //     "ID_Duan": 10,
  //     "ID_Giamsat": 33,
  //     "ID_KhoiCV": 1,
  //     "Ngaysinh": null,
  //     "Sodienthoai": "123",
  //     "ent_chucvu": {
  //       "Chucvu": "Giám sát"
  //     },
  //     "ent_duan": {
  //       "Duan": "Dự án Test"
  //     },
  //     "ent_khoicv": {
  //       "ID_Khoi": 1,
  //       "KhoiCV": "Khối làm sạch"
  //     },
  //     "iQuyen": 1,
  //     "isDelete": 0
  //   },
  //   {
  //     "Gioitinh": "nam",
  //     "Hoten": "Nguyễn Hưng Tiến",
  //     "ID_Chucvu": 2,
  //     "ID_Duan": 10,
  //     "ID_Giamsat": 86,
  //     "ID_KhoiCV": 1,
  //     "Ngaysinh": "2024-07-10T04:51:22.210Z",
  //     "Sodienthoai": "0961228679",
  //     "ent_chucvu": {
  //       "Chucvu": "Giám sát"
  //     },
  //     "ent_duan": {
  //       "Duan": "Dự án Test"
  //     },
  //     "ent_khoicv": {
  //       "ID_Khoi": 1,
  //       "KhoiCV": "Khối làm sạch"
  //     },
  //     "iQuyen": 1,
  //     "isDelete": 0
  //   }
  // ]

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 20 }}>
          <View style={{ justifyContent: "space-around", width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Ngày
                </Text>
                <TextInput
                  allowFontScaling={false}
                  value={dataInput.dateDay}
                  editable={false}
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                      backgroundColor: "#bcbcbc",
                    },
                  ]}
                />
              </View>
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Giờ
                </Text>
                <TextInput
                  allowFontScaling={false}
                  value={dataInput.dateHour}
                  editable={false}
                  placeholderTextColor="gray"
                  style={[
                    styles.textInput,
                    {
                      paddingHorizontal: 10,
                      backgroundColor: "#bcbcbc",
                    },
                  ]}
                />
              </View>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.text}>
                Ca làm việc
              </Text>
              {ent_calv && ent_calv?.length > 0 ? (
                <SelectDropdown
                  data={ent_calv ? ent_calv : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Ca làm việc"}
                  buttonTextStyle={styles.customText}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("Calv", selectedItem);
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        color={"#637381"}
                        size={14}
                        style={{ marginRight: 10 }}
                      />
                    );
                  }}
                  dropdownIconPosition={"right"}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return (
                      <View
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          {selectedItem?.Tenca} -{" "}
                          {selectedItem?.ent_khoicv?.KhoiCV}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Calv}
                        label={`${item?.Tenca} - ${item?.ent_khoicv?.KhoiCV}`}
                        key={index}
                        selectedItem={dataInput?.Calv?.ID_Calv}
                      />
                    );
                  }}
                />
              ) : (
                <Text allowFontScaling={false} style={styles.errorText}>
                  Không có dữ liệu ca làm việc.
                </Text>
              )}
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.text}>
                Nhân viên
              </Text>
              {ent_giamsat && ent_giamsat?.length > 0 ? (
                <SelectDropdown
                  data={ent_giamsat ? ent_giamsat : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Nhân viên"}
                  buttonTextStyle={styles.customText}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("ID_Giamsat", selectedItem.ID_Giamsat);
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        color={"#637381"}
                        size={14}
                        style={{ marginRight: 10 }}
                      />
                    );
                  }}
                  dropdownIconPosition={"right"}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return (
                      <View
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          {selectedItem?.Hoten}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Giamsat}
                        label={item.Hoten}
                        key={index}
                        selectedItem={dataInput.ID_Giamsat}
                      />
                    );
                  }}
                />
              ) : (
                <Text allowFontScaling={false} style={styles.errorText}>
                  Không có dữ liệu nhân viên.
                </Text>
              )}
            </View>
            <View style={{ marginTop: 20 }}>
              <ButtonSubmit
                text={"Tạo ca làm việc"}
                width={"auto"}
                backgroundColor={COLORS.bg_button}
                color={"white"}
                isLoading={isLoading}
                onPress={handlePushDataSave}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalChecklistC;

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
    borderRadius: 8,
    backgroundColor: "white",
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
  selectedTextStyle: {
    // color: COLORS.bg_button,
    fontWeight: "600",
  },
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
