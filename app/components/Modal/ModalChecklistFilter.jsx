import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ActionCheckbox from "../Active/ActiveCheckbox";
import { COLORS } from "../../constants/theme";
import Button from "../Button/Button";
import ActionFilterCheckbox from "../Active/ActiveFilterCheckbox";

const ModalChecklistFilter = ({
  isFilterData,
  ent_tang,
  ent_khuvuc,
  handleChangeFilter,
  handleFilterData,
  handlePushDataCheck,
  handleCheckbox,
  toggleSwitch,
  filters,
  isEnabled,
  hangMuc,
  ent_calv,
}) => {
  const defaultKhuvuc = ent_khuvuc.find(
    (khuvuc) => khuvuc.ID_Khuvuc === isFilterData?.ID_Khuvuc
  );

  const defaultTang = ent_tang.find(
    (Tang) => Tang.ID_Tang === isFilterData?.ID_Tang
  );

  const defaultHangmuc = hangMuc?.find(
    (Hangmuc) => Hangmuc.ID_Hangmuc === isFilterData?.ID_Hangmuc
  );

  const defaultKhoi = ent_calv?.find(
    (Khoi) => Khoi.ID_Calv === isFilterData?.ID_Calamviec
  );

  // cons

  return (
    <View>
      {/* ca lam viec  */}
      {/* <View style={styles.container}>
        <ActionFilterCheckbox
          handleCheckbox={handleCheckbox}
          name={"ID_Calamviec"}
          filters={filters.ID_Calamviec}
        />
        <SelectDropdown
          disabled={!filters?.ID_Calamviec}
          data={ent_calv ? ent_calv : []}
          buttonStyle={styles.select}
          dropdownStyle={{
            borderRadius: 8,
            maxHeight: 400,
          }}
          // rowStyle={{ height: 50, justifyContent: "center" }}
          defaultValue={defaultKhoi}
          defaultButtonText={"Khối công việc"}
          buttonTextStyle={styles.customText}
          onSelect={(selectedItem, index) => {
            handleChangeFilter("ID_Calamviec", selectedItem.ID_Calamviec);
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
                  {" "}
                  {selectedItem?.Tenca}
                </Text>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <VerticalSelect
                value={item.ID_Calamviec}
                label={`${item.Tenca}`}
                key={index}
                selectedItem={isFilterData.ID_Calamviec}
              />
            );
          }}
        />
      </View> */}
      {/* khu vuc  */}
      <View style={styles.container}>
        <ActionFilterCheckbox
          handleCheckbox={handleCheckbox}
          name={"ID_Khuvuc"}
          filters={filters.ID_Khuvuc}
        />
        <SelectDropdown
          disabled={!filters?.ID_Khuvuc}
          data={ent_khuvuc ? ent_khuvuc : []}
          buttonStyle={styles.select}
          dropdownStyle={{
            borderRadius: 8,
            maxHeight: 400,
          }}
          // rowStyle={{ height: 50, justifyContent: "center" }}
          defaultValue={defaultKhuvuc}
          defaultButtonText={"Khu vực"}
          buttonTextStyle={styles.customText}
          onSelect={(selectedItem, index) => {
            handleChangeFilter("ID_Khuvuc", selectedItem.ID_Khuvuc);
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
                  {" "}
                  {selectedItem?.Tenkhuvuc}
                </Text>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <VerticalSelect
                value={item.ID_Khuvuc}
                label={`${item.Tenkhuvuc} - ${item?.ent_toanha.Toanha} - ${item?.ent_khoicv?.KhoiCV}`}
                key={index}
                selectedItem={isFilterData.ID_Khuvuc}
              />
            );
          }}
        />
      </View>
      {/* tang  */}
      <View style={styles.container}>
        <ActionFilterCheckbox
          handleCheckbox={handleCheckbox}
          name={"ID_Tang"}
          filters={filters.ID_Tang}
        />
        <SelectDropdown
          disabled={!filters?.ID_Tang}
          data={ent_tang ? ent_tang : []}
          buttonStyle={styles.select}
          dropdownStyle={{
            borderRadius: 8,
            maxHeight: 400,
          }}
          // rowStyle={{ height: 50, justifyContent: "center" }}
          defaultButtonText={"Tầng"}
          defaultValue={defaultTang}
          buttonTextStyle={styles.customText}
          onSelect={(selectedItem, index) => {
            handleChangeFilter("ID_Tang", selectedItem.ID_Tang);
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
                selectedItem={isFilterData.ID_Tang}
              />
            );
          }}
        />
      </View>
      {/* hang muc  */}
      <View style={styles.container}>
        <ActionFilterCheckbox
          handleCheckbox={handleCheckbox}
          name={"ID_Hangmuc"}
          filters={filters.ID_Hangmuc}
        />
        <SelectDropdown
          disabled={!filters?.ID_Hangmuc}
          data={hangMuc ? hangMuc : []}
          buttonStyle={styles.select}
          dropdownStyle={{
            borderRadius: 8,
            maxHeight: 400,
          }}
          // rowStyle={{ height: 50, justifyContent: "center" }}
          defaultButtonText={"Hạng mục"}
          defaultValue={defaultHangmuc}
          buttonTextStyle={styles.customText}
          onSelect={(selectedItem, index) => {
            handleChangeFilter("ID_Hangmuc", selectedItem.ID_Hangmuc);
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
                  {selectedItem?.Hangmuc}
                </Text>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <VerticalSelect
                value={item.ID_Hangmuc}
                label={item.Hangmuc}
                key={index}
                selectedItem={isFilterData.ID_Hangmuc}
              />
            );
          }}
        />
      </View>

      <View
        style={[
          styles.container,
          { justifyContent: "flex-start", marginLeft: 12 },
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
          
          style={[styles.text, { paddingHorizontal: 0 }]}
        >
          Tất cả
        </Text>
      </View>

      <View style={{ height: 10 }}></View>
      <Button
        color={"white"}
        backgroundColor={COLORS.bg_button}
        text={"Tìm kiếm"}
        onPress={() => handlePushDataCheck(isEnabled)}
      ></Button>
      <View style={{ height: 10 }}></View>
      <Button
        color={COLORS.bg_button}
        text={"Đóng"}
        onPress={() => handleFilterData(false, 1)}
      ></Button>
    </View>
  );
};

export default ModalChecklistFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
  },
  select: {
    width: "80%",
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
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
