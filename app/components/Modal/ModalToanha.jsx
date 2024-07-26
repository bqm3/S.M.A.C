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

const ModalToanha = ({
  ent_duan,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  loadingSubmit,
}) => {
  const ref = useRef(null);

  const defaultDuan = ent_duan?.find(
    (duan) => duan.ID_Duan === dataInput?.ID_Duan
  );
  const [toanha, setToanha] = useState(dataInput?.Toanha);

  return (
    <View style={{ margin: 20 }}>
      <View style={{ justifyContent: "space-around", width: "100%" }}>
        <Text allowFontScaling={false}  style={styles.text}>
          Tên tòa nhà
        </Text>
        <TextInput allowFontScaling={false}
          
          value={toanha}
          placeholder="Nhập tên tòa nhà"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => {
            handleChangeText("Toanha", val);

            setToanha(val);
          }}
        />
        <Text allowFontScaling={false}  style={styles.text}>
          Số tầng
        </Text>
        <TextInput allowFontScaling={false}
          
          value={dataInput.Sotang.toString()}
          placeholder="Nhập số tầng"
          placeholderTextColor="gray"
          style={[
            styles.textInput,
            {
              paddingHorizontal: 10,
            },
          ]}
          autoCapitalize="sentences"
          onChangeText={(val) => handleChangeText("Sotang", val)}
        />

        <View>
          <Text allowFontScaling={false}  style={styles.text}>
            Dự án
          </Text>
          {ent_duan && ent_duan?.length > 0 ? (
            <SelectDropdown
              data={ent_duan ? ent_duan : []}
              buttonStyle={styles.select}
              dropdownStyle={{
                borderRadius: 8,
                maxHeight: 500,
              }}
              // rowStyle={{ height: 50, justifyContent: "center" }}
              defaultButtonText={"Dự án"}
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
                    selectedItem={dataInput.ID_Duan}
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
              ? () => handlePushDataEdit(isCheckUpdate.ID_Toanha)
              : () => handlePushDataSave()
          }
        />
      </View>
    </View>
  );
};

export default ModalToanha;

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
