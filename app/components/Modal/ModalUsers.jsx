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
import React, { useRef, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS } from "../../constants/theme";
import ButtonChecklist from "../Button/ButtonCheckList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalUsers = ({
  ent_chucvu,
  ent_duan,
  ent_khoicv,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  handleEditEnt,
  loadingSubmit,
}) => {
  const ref = useRef(null);

  const defaultChucvu = ent_chucvu?.find(
    (chucvu) => chucvu.ID_Chucvu === (dataInput.Permission || 2)
  );
  const defaultDuan = ent_duan?.find(
    (duan) => duan.ID_Duan === dataInput?.ID_Duan
  );
  const defaultKhoi = ent_khoicv?.find(
    (khoi) => khoi.ID_Khoi === dataInput?.ID_KhoiCV
  );

  const [UserName, setUserName] = useState(dataInput?.UserName);
  const [Emails, setEmails] = useState(dataInput?.Emails);
  const [Password, setPassword] = useState(dataInput?.Password);
  const [rePassword, setrePassword] = useState(dataInput?.rePassword);

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
                <Text allowFontScaling={false}  style={styles.text}>
                  Dự án
                </Text>
                {ent_duan && ent_duan?.length > 0 ? (
                <SelectDropdown
                  data={ent_duan ? ent_duan : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Chọn dự án"}
                  buttonTextStyle={styles.customText}
                  defaultValue={defaultDuan}
                  onSelect={(selectedItem, index) => {
                    handleChangeText("ID_Duan", selectedItem.ID_Duan);
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
                        <Text allowFontScaling={false}  style={styles.text}>
                          {selectedItem?.Duan}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Duan}
                        label={item.Duan}
                        key={index}
                        selectedItem={dataInput?.ID_Duan}
                      />
                    );
                  }}
                />
                 ) : (
                  <Text allowFontScaling={false}  style={styles.errorText}>
                    Không có dữ liệu dự án.
                  </Text>
                )}
              </View>
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false}  style={styles.text}>
                  Chức vụ
                </Text>
                {ent_chucvu && ent_chucvu?.length > 0 ? (
                  <SelectDropdown
                    ref={ref}
                    data={ent_chucvu}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    defaultButtonText={"Chọn chức vụ"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultChucvu}
                    onSelect={(selectedItem, index) => {
                      handleChangeText("Permission", selectedItem.ID_Chucvu);
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
                          <Text allowFontScaling={false}  style={styles.text}>
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
                          selectedItem={dataInput?.Permission}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text allowFontScaling={false}  style={styles.errorText}>
                    Không có dữ liệu chức vụ.
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Text allowFontScaling={false}  style={styles.text}>
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
                      <Text allowFontScaling={false}  style={styles.text}>
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
                      selectedItem={dataInput?.ID_KhoiCV}
                    />
                  );
                }}
              />
              ) : (
                  <Text allowFontScaling={false}  style={styles.errorText}>
                    Không có dữ liệu công việc.
                  </Text>
                )}
            </View>

            <Text allowFontScaling={false}  style={styles.text}>
              Người dùng
            </Text>
            <TextInput allowFontScaling={false}
              
              value={UserName}
              placeholder="Người dùng"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              onChangeText={(val) => {handleChangeText("UserName", val), setUserName(val)}}
            />

            <Text allowFontScaling={false}  style={styles.text}>
              Email
            </Text>
            <TextInput allowFontScaling={false}
              
              value={Emails}
              placeholder="Email"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              onChangeText={(val) => {handleChangeText("Emails", val),setEmails(val)}}
            />

            <Text allowFontScaling={false}  style={styles.text}>
              Mật khẩu
            </Text>
            <TextInput allowFontScaling={false}
              
              value={Password}
              //   maxLength={}
              secureTextEntry={true}
              placeholder="Mật khẩu"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              onChangeText={(val) => {handleChangeText("Password", val),setPassword(val)}}
            />

            <Text allowFontScaling={false}  style={styles.text}>
              Nhập lại mật khẩu
            </Text>
            <TextInput allowFontScaling={false}
              
              value={rePassword}
              //   maxLength={}
              secureTextEntry={true}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="gray"
              style={[
                styles.textInput,
                {
                  paddingHorizontal: 10,
                },
              ]}
              onChangeText={(val) => {handleChangeText("rePassword", val),setrePassword(val)}}
            />
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
                  ? () => handlePushDataEdit(isCheckUpdate.ID_Giamsat)
                  : () => handlePushDataSave()
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalUsers;

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
  errorText: {
    fontWeight: "500",
    fontSize: 15,
  }
});
