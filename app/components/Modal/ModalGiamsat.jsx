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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";
import { FontAwesome, AntDesign } from "@expo/vector-icons";

const dataGioitinh = [
  {
    value: "nam",
    label: "Nam",
  },
  {
    value: "nu",
    label: "Nữ",
  },
  {
    value: "khac",
    label: "Khác",
  },
];

const ModalGiamsat = ({
  ent_chucvu,
  ent_khoicv,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  toggleDatePicker,
  isDatePickerVisible,
  handleConfirm,
  loadingSubmit,
}) => {
  const height = useHeaderHeight();

  const defaultChucvu = ent_chucvu?.find(
    (chucvu) => chucvu.ID_Chucvu === dataInput?.ID_Chucvu
  );
  const defaultKhoi = ent_khoicv?.find(
    (khoi) => khoi.ID_Khoi === dataInput?.ID_KhoiCV
  );
  const defaultGioitinh = dataGioitinh?.find(
    (duan) => duan.value === dataInput?.gioitinh
  );

  const [hoten, setHoten] = useState(dataInput?.hoten);
  const [sodienthoai, setSodienthoai] = useState(dataInput?.sodienthoai);
  const [errorMessage, setErrorMessage] = useState("");

  const validateText = (input) => {
    const regex = /^[A-Za-zÀ-ỹà-ỹ\s]+$/; // Chỉ cho phép các chữ cái và khoảng trắng
    if (regex.test(input)) {
      setErrorMessage("");
    } else {
      setErrorMessage("Chỉ được nhập chữ cái và khoảng trắng");
    }
    setHoten(input);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={height}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
                  <View>
                    <Text allowFontScaling={false} style={styles.text}>
                      Khối công việc
                    </Text>
                    {ent_khoicv && ent_khoicv?.length > 0 ? (
                      <SelectDropdown
                        data={ent_khoicv ? ent_khoicv : []}
                        buttonStyle={styles.select}
                        dropdownStyle={{
                          borderRadius: 8,
                          maxHeight: 400,
                        }}
                        // rowStyle={{ height: 50, justifyContent: "center" }}
                        defaultButtonText={"Chọn khối công việc"}
                        buttonTextStyle={styles.customText}
                        defaultValue={defaultKhoi}
                        onSelect={(selectedItem, index) => {
                          handleChangeText("ID_KhoiCV", selectedItem.ID_Khoi);
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
                              <Text
                                allowFontScaling={false}
                                style={styles.text}
                              >
                                {selectedItem?.KhoiCV}
                              </Text>
                            </View>
                          );
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          return (
                            <VerticalSelect
                              value={item.ID_Khoi}
                              label={item.KhoiCV}
                              key={index}
                              selectedItem={dataInput.ID_KhoiCV}
                            />
                          );
                        }}
                      />
                    ) : (
                      <Text allowFontScaling={false} style={styles.errorText}>
                        Không có dữ liệu khối công việc.
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Chức vụ
                  </Text>
                  {ent_chucvu && ent_chucvu?.length > 0 ? (
                    <SelectDropdown
                      data={ent_chucvu ? ent_chucvu : []}
                      buttonStyle={styles.select}
                      dropdownStyle={{
                        borderRadius: 8,
                        maxHeight: 400,
                      }}
                      defaultButtonText={"Chọn chức vụ"}
                      buttonTextStyle={styles.customText}
                      defaultValue={defaultChucvu}
                      onSelect={(selectedItem, index) => {
                        handleChangeText("ID_Chucvu", selectedItem.ID_Chucvu);
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
                              {selectedItem?.Chucvu}
                            </Text>
                          </View>
                        );
                      }}
                      renderCustomizedRowChild={(item, index) => {
                        return (
                          <VerticalSelect
                            value={item.ID_Chucvu}
                            label={item.Chucvu}
                            key={index}
                            selectedItem={dataInput.ID_Chucvu}
                          />
                        );
                      }}
                    />
                  ) : (
                    <Text allowFontScaling={false} style={styles.errorText}>
                      Không có dữ liệu chức vụ.
                    </Text>
                  )}
                </View>
              </View>

              <Text allowFontScaling={false} style={styles.text}>
                Họ tên
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={hoten}
                placeholder="Nhập họ tên"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                onChangeText={(val) => {
                  handleChangeText("hoten", val), setHoten(val);
                  validateText(val);
                }}
              />
              {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
              ) : null}
              <Text allowFontScaling={false} style={styles.text}>
                Số điện thoại
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                keyboardType="numeric"
                value={sodienthoai}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                onChangeText={(val) => {
                  handleChangeText("sodienthoai", val), setSodienthoai(val);
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Giới tính
                  </Text>

                  <SelectDropdown
                    data={dataGioitinh ? dataGioitinh : []}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    // rowStyle={{ height: 50, justifyContent: "center" }}
                    defaultButtonText={"Chọn giới tính"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultGioitinh}
                    onSelect={(selectedItem, index) => {
                      handleChangeText("gioitinh", selectedItem.value);
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
                            {selectedItem?.label}
                          </Text>
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <VerticalSelect
                          value={item.value}
                          label={item.label}
                          key={index}
                          selectedItem={dataInput.gioitinh}
                        />
                      );
                    }}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Ngày sinh
                  </Text>
                  <TouchableOpacity onPress={toggleDatePicker}>
                    <View style={styles.action}>
                      <BottomSheetTextInput
                        allowFontScaling={false}
                        value={dataInput.ngaysinh}
                        placeholder="Nhập giờ bắt đầu ca làm việc"
                        placeholderTextColor="gray"
                        style={{
                          paddingLeft: 12,
                          color: "#05375a",
                          width: "70%",
                          fontSize: 16,
                          height: 48,
                        }}
                        pointerEvents="none"
                      />
                      <TouchableOpacity
                        onPress={toggleDatePicker}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          height: 48,
                          width: 48,
                        }}
                      >
                        <AntDesign name="calendar" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      isDarkModeEnabled={true}
                      onConfirm={(date) => handleConfirm("ngaysinh", date)}
                      onCancel={toggleDatePicker}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <ButtonSubmit
                text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
                width={"auto"}
                isLoading={loadingSubmit}
                color={"white"}
                backgroundColor={COLORS.bg_button}
                onPress={
                  isCheckUpdate.check
                    ? () => handlePushDataEdit()
                    : () => handlePushDataSave()
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalGiamsat;

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
  action: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
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
  error: {
    color: "red",
    marginTop: 5,
  },
});
