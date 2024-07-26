import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { COLORS } from "../../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";

const ModalKhuvuc = ({
  ent_khoicv,
  ent_toanha,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  loadingSubmit,
}) => {
  const headerHeight = useHeaderHeight();
  const defaultKhoiCV = ent_khoicv?.find(
    (khoicv) => khoicv.ID_Khoi === dataInput?.khoicv
  );
  const defaultToanha = ent_toanha?.find(
    (duan) => duan.ID_Toanha === dataInput?.toanha
  );

  const [tenkhuvuc, setTenkhuvuc] = useState(dataInput?.tenkhuvuc || "");
  const [qrcode, setQrcode] = useState(dataInput?.qrcode || "");
  const [makhuvuc, setMakhuvuc] = useState(dataInput?.makhuvuc || "");
  const [sothutu, setSothutu] = useState(dataInput?.sothutu || "");

  // Log or handle errors gracefully
  useEffect(() => {
    if (!ent_khoicv) console.error("ent_khoicv is not defined");
    if (!ent_toanha) console.error("ent_toanha is not defined");
  }, [ent_khoicv, ent_toanha]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ margin: 20 }}>
            <View style={{ justifyContent: "space-around", width: "100%" }}>
              <View style={{ width: "100%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Khối công việc
                </Text>
                {ent_khoicv && ent_khoicv.length > 0 ? (
                  <SelectDropdown
                    data={ent_khoicv}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    defaultButtonText={"Khối công việc"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultKhoiCV}
                    onSelect={(selectedItem) => {
                      handleChangeText("khoicv", selectedItem.ID_Khoi);
                    }}
                    renderDropdownIcon={(isOpened) => (
                      <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        color={"#637381"}
                        size={14}
                        style={{ marginRight: 10 }}
                      />
                    )}
                    dropdownIconPosition={"right"}
                    buttonTextAfterSelection={(selectedItem) =>
                      selectedItem?.KhoiCV
                    }
                    renderCustomizedRowChild={(item, index) => (
                      <VerticalSelect
                        value={item.ID_Khoi}
                        label={item.KhoiCV}
                        key={index}
                        selectedItem={dataInput.khoicv}
                      />
                    )}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu khối công việc.
                  </Text>
                )}
              </View>

              <View style={{ width: "100%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Tòa nhà
                </Text>
                {ent_toanha && ent_toanha.length > 0 ? (
                  <SelectDropdown
                    data={ent_toanha}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    defaultButtonText={"Tòa nhà"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultToanha}
                    onSelect={(selectedItem) => {
                      handleChangeText("toanha", selectedItem.ID_Toanha);
                    }}
                    renderDropdownIcon={(isOpened) => (
                      <FontAwesome
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        color={"#637381"}
                        size={14}
                        style={{ marginRight: 10 }}
                      />
                    )}
                    dropdownIconPosition={"right"}
                    buttonTextAfterSelection={(selectedItem) =>
                      selectedItem?.Toanha
                    }
                    renderCustomizedRowChild={(item, index) => (
                      <VerticalSelect
                        value={item.ID_Toanha}
                        label={item.Toanha}
                        key={index}
                        selectedItem={dataInput.toanha}
                      />
                    )}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu khối công việc.
                  </Text>
                )}
              </View>

              <Text allowFontScaling={false} style={styles.text}>
                Tên khu vực
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={tenkhuvuc}
                placeholder="Nhập tên khu vực thực hiện checklist"
                placeholderTextColor="gray"
                style={[styles.textInput, { paddingHorizontal: 10 }]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("tenkhuvuc", val);
                  setTenkhuvuc(val);
                }}
              />

              <Text allowFontScaling={false} style={styles.text}>
                Mã Qr code
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={qrcode}
                placeholder="Nhập mã Qr code"
                placeholderTextColor="gray"
                style={[styles.textInput, { paddingHorizontal: 10 }]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("qrcode", val);
                  setQrcode(val);
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
                    Mã khu vực
                  </Text>
                  <BottomSheetTextInput
                    allowFontScaling={false}
                    value={makhuvuc}
                    placeholder="Nhập mã khu vực thực hiện checklist"
                    placeholderTextColor="gray"
                    style={[styles.textInput, { paddingHorizontal: 10 }]}
                    autoCapitalize="sentences"
                    onChangeText={(val) => {
                      handleChangeText("makhuvuc", val);
                      setMakhuvuc(val);
                    }}
                  />
                </View>

                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Số thứ tự
                  </Text>
                  <BottomSheetTextInput
                    allowFontScaling={false}
                    keyboardType="numeric"
                    value={`${sothutu}`}
                    placeholder="Nhập số thứ tự khu vực thực hiện checklist"
                    placeholderTextColor="gray"
                    style={[styles.textInput, { paddingHorizontal: 10 }]}
                    autoCapitalize="sentences"
                    onChangeText={(val) => {
                      handleChangeText("sothutu", val);
                      setSothutu(val);
                    }}
                  />
                </View>
              </View>
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
                    ? () => handlePushDataEdit(isCheckUpdate.id_khuvuc)
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

export default ModalKhuvuc;

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
  },
  headText: {
    textAlign: "center",
    color: COLORS.text_main,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFF1C1",
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
  errorText: {
    color: "red",
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
