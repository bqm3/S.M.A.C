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
import React, { memo, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { COLORS } from "../../constants/theme";
import ButtonSubmit from "../Button/ButtonSubmit";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import VerticalSelect from "../Vertical/VerticalSelect";
import VerticalSelectMul from "../Vertical/VerticalSelectMul";
import SelectDropdown from "react-native-select-dropdown";
import { useHeaderHeight } from "@react-navigation/elements";

const ModalChecklist = ({
  ent_tang,
  ent_khuvuc,
  ent_toanha,
  ent_khoicv,
  ent_calv,
  hangMuc,
  handleChangeText,
  dataInput,
  handlePushDataSave,
  handlePushDataEdit,
  isCheckUpdate,
  handleChangeTextKhuVuc,
  dataCheckKhuvuc,
  handleDataKhuvuc,
  activeKhuVuc,
  dataKhuVuc,
  loadingSubmit,
  setCalvFilter,
  calvFilter,
}) => {
  const ref = useRef(null);
  const height = useHeaderHeight();
  const defaultTang = ent_tang?.find(
    (tang) => tang.ID_Tang === dataInput?.ID_Tang
  );
  const defaultToanha = ent_toanha?.find(
    (toanha) => toanha.ID_Toanha === dataCheckKhuvuc?.ID_Toanha
  );
  const defaultKhoi = ent_khoicv?.find(
    (Khoi) => Khoi.ID_Khoi === dataCheckKhuvuc?.ID_KhoiCV
  );
  const defaultKhuvuc = ent_khuvuc?.find(
    (Khuvuc) => Khuvuc.ID_Khuvuc === dataInput?.ID_Khuvuc
  );

  const defaultHangmuc = hangMuc?.find(
    (Hangmuc) => Hangmuc.ID_Hangmuc === dataInput?.ID_Hangmuc
  );

  const defaultButtonText = defaultTang ? defaultTang : "Tầng";

  // Tạo state cho Tiêu chuẩn và Ghi chú
  const [tieuchuan, setTieuchuan] = useState(dataInput?.Tieuchuan);
  const [ghichu, setGhichu] = useState(dataInput?.Ghichu);

  // Tạo state cho Số thứ tự và Mã số
  const [sothutu, setSothutu] = useState(dataInput?.Sothutu);
  const [maso, setMaso] = useState(dataInput?.Maso);

  // Tạo state cho Mã Qr code, Tên checklist, Giá trị định danh, Giá trị nhận
  const [maQrCode, setMaQrCode] = useState(dataInput?.MaQrCode);
  const [tenChecklist, setTenChecklist] = useState(dataInput?.Checklist);
  const [giatridinhdanh, setGiatridinhdanh] = useState(
    dataInput?.Giatridinhdanh
  );
  const [giatrinhan, setGiatrinhan] = useState(dataInput?.Giatrinhan);

  const handleSelect = (selectedItem, index) => {
    const isAlreadySelected = calvFilter.includes(selectedItem.ID_Calv);

    // If the item is already selected, remove it from the array
    if (isAlreadySelected) {
      setCalvFilter(calvFilter.filter((id) => id !== selectedItem.ID_Calv));
    } else {
      // Otherwise, add the item to the array
      setCalvFilter([...calvFilter, selectedItem.ID_Calv]);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={height}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView style={{ margin: 20 }}>
            <View style={{ justifyContent: "space-around", width: "100%" }}>
              {/* Tòa nhà và khối công việc  */}

              <View style={{ width: "100%" }}>
                <Text allowFontScaling={false} style={styles.text}>
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
                      handleChangeTextKhuVuc(
                        "ID_Toanha",
                        selectedItem.ID_Toanha
                      );
                      handleDataKhuvuc({
                        ID_Toanha: selectedItem.ID_Toanha,
                        ID_KhoiCV: dataCheckKhuvuc.ID_KhoiCV,
                      });
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
                          <Text allowFontScaling={false} style={[styles.text]}>
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
                          selectedItem={dataCheckKhuvuc.ID_Toanha}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ khối công việc.
                  </Text>
                )}
              </View>

              <View style={{ width: "100%" }}>
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
                    defaultButtonText={"Khối công việc"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultKhoi}
                    onSelect={(selectedItem, index) => {
                      handleChangeTextKhuVuc("ID_KhoiCV", selectedItem.ID_Khoi);
                      handleDataKhuvuc({
                        ID_Toanha: dataCheckKhuvuc.ID_Toanha,
                        ID_KhoiCV: selectedItem.ID_Khoi,
                      });
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
                          selectedItem={dataCheckKhuvuc.ID_KhoiCV}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    Không có dữ khối công việc.
                  </Text>
                )}
              </View>

              {/* Tầng  */}
              <View style={{ width: "100%" }}>
                <Text allowFontScaling={false} style={styles.text}>
                  Tầng
                </Text>
                {ent_tang && ent_tang?.length > 0 ? (
                  <SelectDropdown
                    ref={ref}
                    data={ent_tang ? ent_tang : []}
                    buttonStyle={styles.select}
                    dropdownStyle={{
                      borderRadius: 8,
                      maxHeight: 400,
                    }}
                    // rowStyle={{ height: 50, justifyContent: "center" }}
                    defaultButtonText={"Tầng"}
                    buttonTextStyle={styles.customText}
                    defaultValue={defaultButtonText}
                    onSelect={(selectedItem, index) => {
                      handleChangeText("ID_Tang", selectedItem.ID_Tang);
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
                        <Text
                          allowFontScaling={false}
                          style={styles.text}
                          numberOfLines={3}
                        >
                          {selectedItem?.Tentang}
                        </Text>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <VerticalSelect
                          value={item.ID_Tang}
                          label={item.Tentang}
                          key={index}
                          selectedItem={dataInput?.ID_Tang}
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

              {/* hạng mục và khu vực  */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "48%" }}>
                  {activeKhuVuc && (
                    <>
                      <Text allowFontScaling={false} style={styles.text}>
                        Khu vực
                      </Text>
                      {dataKhuVuc && dataKhuVuc?.length > 0 ? (
                        <SelectDropdown
                          ref={ref}
                          data={dataKhuVuc ? dataKhuVuc : []}
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
                            handleChangeText(
                              "ID_Khuvuc",
                              selectedItem.ID_Khuvuc
                            );
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
                              <Text
                                allowFontScaling={false}
                                style={[styles.text]}
                                numberOfLines={3}
                              >
                                {selectedItem?.Tenkhuvuc}
                              </Text>
                            );
                          }}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <VerticalSelect
                                value={item.ID_Khuvuc}
                                label={`${item.Tenkhuvuc} - ${item?.ent_khoicv.KhoiCV}`}
                                key={index}
                                selectedItem={dataInput?.ID_Khuvuc}
                              />
                            );
                          }}
                        />
                      ) : (
                        <Text allowFontScaling={false} style={styles.errorText}>
                          Không có dữ liệu khu vực.
                        </Text>
                      )}
                    </>
                  )}
                </View>
                {
                  <View style={{ width: "48%" }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      Hạng mục
                    </Text>
                    {hangMuc && hangMuc?.length > 0 ? (
                      <SelectDropdown
                        ref={ref}
                        data={hangMuc ? hangMuc : []}
                        buttonStyle={styles.select}
                        dropdownStyle={{
                          borderRadius: 8,
                          maxHeight: 400,
                        }}
                        // rowStyle={{ height: 50, justifyContent: "center" }}
                        defaultButtonText={"Hạng mục"}
                        buttonTextStyle={styles.customText}
                        defaultValue={defaultHangmuc}
                        onSelect={(selectedItem, index) => {
                          handleChangeText(
                            "ID_Hangmuc",
                            selectedItem.ID_Hangmuc
                          );
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
                            <Text
                              allowFontScaling={false}
                              style={styles.text}
                              numberOfLines={3}
                            >
                              {selectedItem?.Hangmuc}
                            </Text>
                          );
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          return (
                            <VerticalSelect
                              value={item.ID_Hangmuc}
                              label={`${item.Hangmuc}`}
                              key={index}
                              selectedItem={dataInput?.ID_Hangmuc}
                            />
                          );
                        }}
                      />
                    ) : (
                      <Text allowFontScaling={false} style={styles.errorText}>
                        Không có dữ liệu hạng mục.
                      </Text>
                    )}
                  </View>
                }
              </View>

              {/* Ca làm việc  */}
              <View style={{ width: "100%" }}>
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
                    // defaultValue={defaultKhoi}
                    onSelect={(selectedItem, index) => {
                      handleSelect(selectedItem, index);
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
                            Ca làm việc
                          </Text>
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index) => {
                      return (
                        <VerticalSelectMul
                          value={item.ID_Calv}
                          item={item}
                          label={`${item.Tenca} - ${item?.ent_khoicv?.KhoiCV}`}
                          key={index}
                          selectedItem={calvFilter}
                          handleSelect={handleSelect}
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

              {/* Số thứ tự - Mã số  */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Số thứ tự
                  </Text>
                  <BottomSheetTextInput
                    allowFontScaling={false}
                    keyboardType="numeric"
                    value={`${sothutu}`}
                    placeholder="Số thứ tự"
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                      },
                    ]}
                    onChangeText={(val) => {
                      setSothutu(val);
                      handleChangeText("Sothutu", val);
                    }}
                    //   pointerEvents="none"
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Text allowFontScaling={false} style={styles.text}>
                    Mã số
                  </Text>
                  <BottomSheetTextInput
                    allowFontScaling={false}
                    value={maso}
                    placeholder="Mã số"
                    placeholderTextColor="gray"
                    style={[
                      styles.textInput,
                      {
                        paddingHorizontal: 10,
                      },
                    ]}
                    onChangeText={(val) => {
                      setMaso(val);
                      handleChangeText("Maso", val);
                    }}
                    //   pointerEvents="none"
                  />
                </View>
              </View>

              {/* Mã Qr code  */}
              <Text allowFontScaling={false} style={styles.text}>
                Mã Qr code
              </Text>

              <BottomSheetTextInput
                allowFontScaling={false}
                value={maQrCode}
                placeholder="Nhập Qr code"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("MaQrCode", val), setMaQrCode(val);
                }}
              />

              {/* Tên checklist  */}
              <Text allowFontScaling={false} style={styles.text}>
                Tên Checklist
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={tenChecklist}
                placeholder="Nhập tên Checklist"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("Checklist", val), setTenChecklist(val);
                }}
              />

              {/* Tiêu chuẩn  */}
              <Text allowFontScaling={false} style={styles.text}>
                Tiêu chuẩn
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={tieuchuan}
                placeholder="Nhập tiêu chuẩn"
                placeholderTextColor="gray"
                textAlignVertical="top"
                multiline={true}
                blurOnSubmit={true}
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                    height: 70,
                  },
                ]}
                onChangeText={(text) => {
                  setTieuchuan(text);
                  handleChangeText("Tieuchuan", text);
                }}
              />
              <Text allowFontScaling={false} style={styles.text}>
                Giá trị định danh
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={giatridinhdanh}
                placeholder="Nhập giá trị định danh"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("Giatridinhdanh", val),
                    setGiatridinhdanh(val);
                }}
              />
              <Text allowFontScaling={false} style={styles.textNote}>
                Nếu không có thì không phải nhập
              </Text>

              <Text allowFontScaling={false} style={styles.text}>
                Giá trị nhận
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={giatrinhan}
                placeholder="Nhập giá trị nhận"
                placeholderTextColor="gray"
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                  },
                ]}
                autoCapitalize="sentences"
                onChangeText={(val) => {
                  handleChangeText("Giatrinhan", val);
                  setGiatrinhan(val);
                }}
              />
              <Text
                allowFontScaling={false}
                style={[styles.textNote, { color: "red" }]}
              >
                Tại ô Giá trị nhận nhập theo định dạng - Giá trị 1/Giá trị 2...
                (Ví dụ : Sáng/Tắt, Bật/Tắt, Đạt/Không đạt, On/Off,..)
              </Text>

              {/* Ghi chú  */}
              <Text allowFontScaling={false} style={styles.text}>
                Ghi chú
              </Text>
              <BottomSheetTextInput
                allowFontScaling={false}
                value={ghichu}
                placeholder="Nhập ghi chú"
                placeholderTextColor="gray"
                textAlignVertical="top"
                multiline={true}
                blurOnSubmit={true}
                style={[
                  styles.textInput,
                  {
                    paddingHorizontal: 10,
                    height: 70,
                  },
                ]}
                onChangeText={(text) => {
                  setGhichu(text);
                  handleChangeText("Ghichu", text);
                }}
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
                    ? () => handlePushDataEdit(isCheckUpdate.ID_CheckList)
                    : () => handlePushDataSave()
                }
              />
              <View style={{ height: 20 }}></View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalChecklist;

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
  textNote: { color: "gray", fontSize: 13, padding: 2, fontStyle: "italic" },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
