import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import React, { useRef, useState } from "react";
import BottomSheet, {
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS } from "../../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";
import { useHeaderHeight } from "@react-navigation/elements";

const ModalHangmuc = ({
  ent_khuvuc,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  loadingSubmit,
}) => {
  const ref = useRef(null);
  const height = useHeaderHeight();
  const defaultKhuvuc = ent_khuvuc?.find(
    (khuvuc) => khuvuc.ID_Khuvuc === dataInput?.ID_Khuvuc
  );
  const [MaQrCode, setMaQrCode] = useState(dataInput?.MaQrCode);
  const [Hangmuc, setHangmuc] = useState(dataInput?.Hangmuc);
  const [Tieuchuankt, setTieuchuankt] = useState(dataInput?.Tieuchuankt);

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
              {/* select  khu vuc */}
              <View>
                <Text allowFontScaling={false} style={styles.text}>
                  Khu vực
                </Text>
                {ent_khuvuc && ent_khuvuc?.length > 0 ? (
                  <SelectDropdown
                    data={ent_khuvuc ? ent_khuvuc : []}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 500,
                    }}
                    // rowStyle={{ height: 50, justifyContent: "center" }}
                    defaultButtonText={"Khu vực"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultKhuvuc}
                    onSelect={(selectedItem, index) => {
                      handleChangeText("ID_Khuvuc", selectedItem.ID_Khuvuc);
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
                            {selectedItem?.Tenkhuvuc} -{" "}
                            {selectedItem?.ent_khoicv?.KhoiCV}
                          </Text>
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <VerticalSelect
                          value={item.ID_Khuvuc}
                          label={`${item?.Tenkhuvuc} - ${item?.ent_khoicv?.KhoiCV}`}
                          key={index}
                          selectedItem={dataInput?.ID_Khuvuc}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ liệu tầng.
                  </Text>
                )}
              </View>

              {/* Qrcode  */}
              <Text allowFontScaling={false} style={styles.text}>
                Qr Code
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={MaQrCode}
                placeholder="Nhập Qr Code"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("MaQrCode", val);
                  setMaQrCode(val);
                }}
              />

              {/* Hạng mục  */}
              <Text allowFontScaling={false} style={styles.text}>
                Hạng mục
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={Hangmuc}
                placeholder="Nhập Hạng mục"
                placeholderTextColor="gray"
                textAlignVertical="top"
                multiline={true}
                blurOnSubmit={false}
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                    height: 100,
                  },
                ]}
                onChangeText={(text) => {
                  setHangmuc(text);
                  handleChangeText("Hangmuc", text);
                }}
              />

              {/* Tiêu chuẩn kiểm tra  */}
              <Text allowFontScaling={false} style={styles.text}>
                Tiêu chuẩn kiểm tra
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={Tieuchuankt}
                placeholder="Nhập Tiêu chuẩn kiểm tra"
                placeholderTextColor="gray"
                textAlignVertical="top"
                multiline={true}
                blurOnSubmit={false}
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                    height: 100,
                  },
                ]}
                onChangeText={(text) => {
                  setTieuchuankt(text);
                  handleChangeText("Tieuchuankt", text);
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
                    ? () => handlePushDataEdit(isCheckUpdate.ID_Hangmuc)
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

export default ModalHangmuc;

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
