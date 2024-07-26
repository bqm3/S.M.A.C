import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import SelectDropdown from "react-native-select-dropdown";
import ActionCheckbox from "../Active/ActiveCheckbox";
import { COLORS } from "../../constants/theme";
import Button from "../Button/Button";
import ActionFilterCheckbox from "../Active/ActiveFilterCheckbox";

const ModalChitietChecklist = ({
  dataItem,
  ent_tang,
  ent_khuvuc,
  ent_toanha,
  toggleSwitch,
  filterData,
  isFilter,
  isEnabled,
  handleCheckbox,
  handleChangeFilter,
  handleCloseModal,
  handlePushDataFilter
}) => {
  const defaultKhuvuc = ent_khuvuc?.find(
    (khuvuc) => khuvuc?.ID_Khuvuc === filterData?.ID_Khuvuc
  );

  const defaultTang = ent_tang?.find(
    (Tang) => Tang?.ID_Tang === filterData?.ID_Tang
  );

  const defaultToanha = ent_toanha?.find(
    (Toanha) => Toanha?.ID_Toanha === filterData?.ID_Toanha
  );

  return (
    <View style={{ marginHorizontal: 20 }}>
      <View style={styles.container}>
        <ActionFilterCheckbox
          size={20}
          handleCheckbox={handleCheckbox}
          name={"ID_Khuvuc"}
          filters={isFilter.ID_Khuvuc}
        />
        <SelectDropdown
          disabled={!isFilter?.ID_Khuvuc}
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
                <Text allowFontScaling={false}   style={styles.text}> {selectedItem?.Tenkhuvuc}</Text>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <VerticalSelect
                value={item.ID_Khuvuc}
                label={`${item.Tenkhuvuc} - ${item?.ent_toanha.Toanha}`}
                key={index}
                selectedItem={filterData.ID_Khuvuc}
              />
            );
          }}
        />
      </View>
      <View style={styles.container}>
        <ActionFilterCheckbox
          size={20}
          handleCheckbox={handleCheckbox}
          name={"ID_Tang"}
          filters={isFilter.ID_Tang}
        />
        <SelectDropdown
          disabled={!isFilter?.ID_Tang}
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
                <Text allowFontScaling={false}   style={styles.text}>{selectedItem?.Tentang}</Text>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <VerticalSelect
                value={item.ID_Tang}
                label={item.Tentang}
                key={index}
                selectedItem={filterData.ID_Tang}
              />
            );
          }}
        />
      </View>
      <View style={styles.container}>
        <ActionFilterCheckbox
          size={20}
          handleCheckbox={handleCheckbox}
          name={"ID_Toanha"}
          filters={isFilter.ID_Toanha}
        />
        <SelectDropdown
          disabled={!isFilter?.ID_Toanha}
          data={ent_toanha ? ent_toanha : []}
          buttonStyle={styles.select}
          dropdownStyle={{
            borderRadius: 8,
            maxHeight: 400,
          }}
          // rowStyle={{ height: 50, justifyContent: "center" }}
          defaultButtonText={"Tòa nhà"}
          defaultValue={defaultToanha}
          buttonTextStyle={styles.customText}
          onSelect={(selectedItem, index) => {
            handleChangeFilter("ID_Toanha", selectedItem.ID_Toanha);
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
                <Text allowFontScaling={false}   style={styles.text}>{selectedItem?.Toanha}</Text>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <VerticalSelect
                value={item.ID_Toanha}
                label={item.Toanha}
                key={index}
                selectedItem={filterData.ID_Toanha}
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
        <Text allowFontScaling={false}   style={[styles.text, { paddingHorizontal: 0 }]}>Tất cả</Text>
      </View>
      <View style={{ height: 10 }}></View>
      <Button
        color={"white"}
        backgroundColor={COLORS.bg_button}
        text={"Tìm kiếm"}
        onPress={() => handlePushDataFilter()}
      ></Button>
      <View style={{ height: 10 }}></View>
      <Button
        color={COLORS.bg_button}
        text={"Đóng"}
        onPress={() => handleCloseModal()}
      ></Button>
    </View>
  );
};

export default ModalChitietChecklist;

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
