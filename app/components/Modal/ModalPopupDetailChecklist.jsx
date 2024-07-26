import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import Button from "../Button/Button";
import { COLORS, SIZES } from "../../constants/theme";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";

const ModalPopupDetailChecklist = ({
  handlePopupClear,
  dataItem,
  index,
  handleItemClick,
  handleChange,
}) => {
  const ref = useRef(null);
  const [step, setStep] = useState(1);
  const [defaultChecklist, setDefaultChecklist] = useState(dataItem?.valueCheck);
  const [image, setImage] = useState();
  const [ghichu, setGhichu] = useState();

  const pickImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      dataItem.Anh = result?.assets[0];
      handleChange("Anh", result?.assets[0], dataItem);
      setImage(result?.assets[0]);
    }
  };

  useEffect(() => {
    setImage(dataItem?.Anh);
    setGhichu(dataItem?.GhichuChitiet);
  }, [dataItem]);

  return (
    <View style={{ width: SIZES.width - 60 }}>
      {step === 1 && (
        <View>
          <Text allowFontScaling={false}  style={styles.text}>
            Trạng thái
          </Text>
          <SelectDropdown
            ref={ref}
            data={dataItem?.Giatrinhan ? dataItem?.Giatrinhan : []}
            buttonStyle={styles.select}
            dropdownStyle={{
              borderRadius: 8,
              maxHeight: 400,
            }}
            // rowStyle={{ height: 50, justifyContent: "center" }}
            defaultButtonText={"Trạng thái"}
            buttonTextStyle={styles.customText}
            defaultValue={defaultChecklist}
            onSelect={(selectedItem, i) => {
              dataItem.valueCheck = selectedItem;
              handleItemClick(selectedItem, dataItem, "option");
              setDefaultChecklist(selectedItem);
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
                  <Text allowFontScaling={false}  style={[styles.text]}>
                    {selectedItem}
                  </Text>
                </View>
              );
            }}
            renderCustomizedRowChild={(item, index) => {
              return (
                <VerticalSelect
                  value={item}
                  label={item}
                  key={item}
                  selectedItem={defaultChecklist}
                />
              );
            }}
          />
        </View>
      )}
      {step === 2 && (
        <>
          <View style={styles.container}>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: SIZES.padding,
                borderRadius: SIZES.borderRadius,
                borderColor: COLORS.bg_button,
                borderWidth: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
              }}
              onPress={pickImage}
            >
              <Entypo name="camera" size={24} color="black" />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 30 }}
            >
              {image && (
                <Image source={{ uri: image?.uri }} style={styles.image} />
              )}
              {image && (
                <TouchableOpacity
                  onPress={() => {
                    setImage(null);
                    handleChange("Anh", null, dataItem);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
                >
                  <AntDesign name="close" size={24} color="black" />
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "600" }}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                handleChange("Anh", image, dataItem);
                handlePopupClear();
              }}
              backgroundColor={COLORS.bg_button}
              border={COLORS.bg_button}
              color={"white"}
              text={"Hoàn thành"}
              width={"100%"}
            />
          </View>
        </>
      )}
      {step === 3 && (
        <View>
          <Text allowFontScaling={false}  style={styles.text}>
            Ghi chú
          </Text>
          <TextInput allowFontScaling={false}
            
            value={ghichu}
            placeholder="Thêm ghi chú"
            placeholderTextColor="gray"
            multiline={true}
            blurOnSubmit={true}
            onChangeText={(text) => {
              setGhichu(text);
            }}
            style={[
              styles.textInput,
              {
                paddingHorizontal: 10,
              },
            ]}
          />
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                
                dataItem.GhichuChitiet = ghichu;
                handleChange("GhichuChitiet", ghichu, dataItem);
                handlePopupClear();
              }}
              backgroundColor={COLORS.bg_button}
              border={COLORS.bg_button}
              color={"white"}
              text={"Hoàn thành"}
              width={"100%"}
            />
          </View>
        </View>
      )}
      {step === 1 && (
        <>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                setStep(2);
              }}
              backgroundColor={COLORS.bg_white}
              border={COLORS.bg_button}
              color={"black"}
              text={"Chụp ảnh"}
              width={"100%"}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                setStep(3);
              }}
              backgroundColor={COLORS.bg_white}
              border={COLORS.bg_button}
              color={"black"}
              text={"Thêm ghi chú"}
              width={"100%"}
            />
          </View>
        </>
      )}

      <View style={{ marginTop: 10 }}>
        <Button
          onPress={() => {
            step === 1 ? handlePopupClear() : setStep(1);
          }}
          backgroundColor={step === 1 ? COLORS.bg_button : COLORS.bg_white}
          border={COLORS.bg_button}
          color={step === 1 ? "white" : "black"}
          text={step === 1 ? "Đóng" : "Quay lại"}
          width={"100%"}
        />
      </View>
    </View>
  );
};

export default ModalPopupDetailChecklist;

const styles = StyleSheet.create({
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
    zIndex: 1,
  },
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
    paddingLeft: 10,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 100,
    paddingVertical: 4,
    backgroundColor: "white",
    textAlign: "left",
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: "center",
    marginVertical: 10,
  },
});
