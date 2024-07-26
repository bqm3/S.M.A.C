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
  Switch,
} from "react-native";
import React, { useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { COLORS } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import moment from "moment";
import Button from "../Button/Button";
import ButtonSubmit from "../Button/ButtonSubmit";

const ModalTracuu = ({
  handleChangeFilters,
  filters,
  toggleDatePicker,
  handlePresentModalClose,
  isDatePickerVisible,
  ent_toanha,
  ent_tang,
  ent_khuvuc,
  toggleSwitch,
  isEnabled,
  fetchData,
  dataKhuvuc,
}) => {
  const ref = useRef(null);
  const defaultKhuvuc = dataKhuvuc.find(
    (khuvuc) => khuvuc.ID_Khuvuc === filters?.ID_Khuvuc
  );

  const defaultTang = ent_tang.find(
    (tang) => tang.ID_Tang === filters?.ID_Tang
  );

  const defaultToanha = ent_toanha.find(
    (toanha) => toanha.ID_Toanha === filters?.ID_Toanha
  );

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
                  Từ ngày
                </Text>

                <TouchableOpacity
                  onPress={() => toggleDatePicker("fromDate", true)}
                >
                  <View style={styles.action}>
                    <TextInput allowFontScaling={false}
                      
                      value={filters?.fromDate}
                      placeholder="Từ ngày"
                      placeholderTextColor="gray"
                      style={{
                        paddingLeft: 12,
                        color: "#05375a",
                        width: "70%",
                        fontSize: 16,
                        height: 50,
                      }}
                      pointerEvents="none"
                    />
                    <TouchableOpacity
                      onPress={() => toggleDatePicker("fromDate", true)}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 50,
                        width: 50,
                      }}
                    >
                      <AntDesign name="calendar" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible?.fromDate}
                    mode="date"
                    display="inline"
                    isDarkModeEnabled={true}
                    onConfirm={(date) => {
                      handleChangeFilters(
                        "fromDate",
                        moment(date).format("YYYY-MM-DD")
                      );
                      toggleDatePicker("fromDate", false);
                    }}
                    onCancel={() => toggleDatePicker("fromDate", false)}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false}  style={styles.text}>
                  Đến ngày
                </Text>
                <TouchableOpacity
                  onPress={() => toggleDatePicker("toDate", true)}
                >
                  <View style={styles.action}>
                    <TextInput allowFontScaling={false}
                      
                      value={filters?.toDate}
                      placeholder="Đến ngày"
                      placeholderTextColor="gray"
                      style={{
                        paddingLeft: 12,
                        color: "#05375a",
                        width: "70%",
                        fontSize: 16,
                        height: 50,
                      }}
                      pointerEvents="none"
                    />
                    <TouchableOpacity
                      onPress={() => toggleDatePicker("toDate", true)}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 50,
                        width: 50,
                      }}
                    >
                      <AntDesign name="calendar" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible?.toDate}
                    mode="date"
                    display="inline"
                    isDarkModeEnabled={true}
                    onConfirm={(date) => {
                      handleChangeFilters(
                        "toDate",
                        moment(date).format("YYYY-MM-DD")
                      );
                      toggleDatePicker("toDate", false);
                    }}
                    onCancel={() => toggleDatePicker("toDate", false)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text allowFontScaling={false}  style={styles.text}>
                Tòa nhà
              </Text>
              {ent_toanha && ent_toanha?.length > 0 ? (
                <SelectDropdown
                  data={ent_toanha ? ent_toanha : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Tòa nhà"}
                  buttonTextStyle={styles.customText}
                  defaultValue={defaultToanha}
                  onSelect={(selectedItem, index) => {
                    handleChangeFilters("ID_Toanha", selectedItem?.ID_Toanha);
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
                        key={index}
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text allowFontScaling={false}  style={styles.text}>
                          {selectedItem?.Toanha}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Toanha}
                        label={item.Toanha}
                        key={index}
                        selectedItem={filters?.ID_Toanha}
                      />
                    );
                  }}
                />
              ) : (
                <Text allowFontScaling={false}  style={styles.errorText}>
                  Không có dữ liệu tòa nhà.
                </Text>
              )}
            </View>
            <View>
              <Text allowFontScaling={false}  style={styles.text}>
                Khu vực
              </Text>
              {dataKhuvuc && dataKhuvuc?.length > 0 ? (
                <SelectDropdown
                  data={dataKhuvuc ? dataKhuvuc : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Khu vực"}
                  buttonTextStyle={styles.customText}
                  defaultValue={defaultKhuvuc}
                  onSelect={(selectedItem, index) => {
                    handleChangeFilters("ID_Khuvuc", selectedItem?.ID_Khuvuc);
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
                        key={index}
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text allowFontScaling={false}  style={styles.text}>
                          {" "}
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
                        label={`${item.Tenkhuvuc} - ${item?.ent_khoicv?.KhoiCV}`}
                        key={index}
                        selectedItem={filters?.ID_Khuvuc}
                      />
                    );
                  }}
                />
              ) : (
                <Text allowFontScaling={false}  style={styles.errorText}>
                  Không có dữ liệu khu vực.
                </Text>
              )}
            </View>

            <View>
              <Text allowFontScaling={false}  style={styles.text}>
                Tầng
              </Text>
              {ent_tang && ent_tang?.length > 0 ? (
                <SelectDropdown
                  data={ent_tang ? ent_tang : []}
                  buttonStyle={styles.select}
                  dropdownStyle={{
                    borderRadius: 8,
                    maxHeight: 400,
                  }}
                  // rowStyle={{ height: 50, justifyContent: "center" }}
                  defaultButtonText={"Tầng"}
                  buttonTextStyle={styles.customText}
                  defaultValue={defaultTang}
                  onSelect={(selectedItem, index) => {
                    handleChangeFilters("ID_Tang", selectedItem?.ID_Tang);
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
                        key={index}
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          height: 50,
                        }}
                      >
                        <Text allowFontScaling={false}  style={styles.text}>
                          {selectedItem?.Tentang}
                        </Text>
                      </View>
                    );
                  }}
                  renderCustomizedRowChild={(item, index) => {
                    return (
                      <VerticalSelect
                        value={item.ID_Tang}
                        label={item.Tentang}
                        key={index}
                        selectedItem={filters?.ID_Tang}
                      />
                    );
                  }}
                />
              ) : (
                <Text allowFontScaling={false}  style={styles.errorText}>
                  Không có dữ liệu tầng.
                </Text>
              )}
            </View>
            <View style={{ height: 10 }}></View>
            <View
              style={[
                styles.container,
                { justifyContent: "flex-start", flexDirection: "row" },
              ]}
            >
              <Switch
                trackColor={{ false: "#red", true: COLORS.bg_button }}
                thumbColor={isEnabled ? COLORS.color_bg : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(isEnabled)}
                value={isEnabled}
              />
              <Text allowFontScaling={false}
                
                style={[styles.text, { paddingHorizontal: 12 }]}
              >
                Tất cả
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <ButtonSubmit
              text={"Tìm kiếm"}
              width={"auto"}
              backgroundColor={COLORS.bg_button}
              color={"white"}
              onPress={() => {
                fetchData(filters);
              }}
            />
            <View style={{ height: 10 }} />
            <Button
              text={"Đóng"}
              width={"auto"}
              backgroundColor={COLORS.bg_white}
              color={COLORS.color_bg}
              onPress={() => {
                handlePresentModalClose();
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalTracuu;

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
    height: 50,
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
});
