import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TextInput,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useState, useContext } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import adjust from "../../constants/adjust";
import axios from "axios";
import ScanContext from "../../context/ScanContext";
import VerticalSelect from "../../components/Vertical/VerticalSelect";
import { FontAwesome, AntDesign, Feather, Entypo } from "@expo/vector-icons";
import { BASE_URL_ASSETS } from "../../constants/config";
import { COLORS } from "../../constants/theme";
import ButtonSubmit from "../../components/Button/ButtonSubmit";
import ItemPhieuNhapXuat from "../../components/Item/ItemPhieuNhapXuat";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const dataQuy = [
  {
    value: "1",
    label: "Quý I",
  },
  {
    value: "2",
    label: "Quý II",
  },
  {
    value: "3",
    label: "Quý III",
  },
  {
    value: "4",
    label: "Quý IV",
  },
];

function getQuarter(month) {
  if (month >= 1 && month <= 3) {
    return 1;
  } else if (month >= 4 && month <= 6) {
    return 2;
  } else if (month >= 7 && month <= 9) {
    return 3;
  } else if (month >= 10 && month <= 12) {
    return 4;
  } else {
    return null; // Trường hợp tháng không hợp lệ
  }
}

const ScanScreen = ({ navigation }) => {
  const { userAsset, authTokenAsset } = useSelector(
    (state) => state.authReducer
  );

  const { step, saveStep, setPhieuNXContext, phieuNXContext } =
    useContext(ScanContext);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const height = useHeaderHeight();
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [taisanQr, setTaiSanQr] = useState([]);

  const [defaultQuy, setDefaultQuy] = useState(null);
  const [defaultPB, setDefaultPB] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [phongBanDA, setPhongBanDA] = useState([]);
  const [phieuNX, setPhieuNX] = useState([]);
  const [newActionQuanlyTaisan, setNewActionQuanlyTaisan] = useState([]);

  const [dataInput, setDataInput] = useState({
    ID_Phongban: null,
    NgayNX: new Date(),
    ID_Quy: null,
    Sophieu: null,
    Ghichu: "",
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleConfirm = (key, date) => {
    const dateF = formatDate(date);
    handleChangeText(key, dateF);
    setDatePickerVisibility(false);
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  useEffect(() => {
    async function fetchDataTaiSan() {
      setLoading(true);
      const res = await axios.get(BASE_URL_ASSETS + "/tb_taisanqrcode/all");
      if (res.status == 200) {
        setTaiSanQr(res.data.data);
        setLoading(false);
      } else {
        setTaiSanQr([]);
        setLoading(false);
      }
    }
    fetchDataTaiSan();
  }, []);

  useEffect(() => {
    const resDataPhongbanda = async () => {
      await axios
        .get(BASE_URL_ASSETS + "/ent_phongbanda/all")
        .then((res) => {
          const data = res.data.data;
          const dataNoiNhap = data?.filter((item) => item.Thuoc === "PMC");
          setPhongBanDA(dataNoiNhap);
        })
        .catch((err) => console.log("err1", err));
    };
    resDataPhongbanda();
  }, []);

  useEffect(() => {
    const currentQuarter = getQuarter(currentMonth);
    const res = async () => {
      await axios
        .get(
          BASE_URL_ASSETS + `/tb_phieunx/kiemke/${currentQuarter}`,

          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenAsset,
            },
          }
        )
        .then((res) => {
          const data = res.data.data;
          setPhieuNX(data);
        })
        .catch((err) => {
          console.log("err2", err.response);
        });
    };

    res();
  }, [currentMonth]);

  useEffect(() => {
    const defaultPB = phongBanDA?.find(
      (pb) => pb.ID_Phongban === dataInput?.ID_Phongban
    );

    const defaultQuy = dataQuy.find((pb) => pb.ID_Quy === dataInput?.ID_Quy);

    setDefaultQuy(defaultQuy);
    setDefaultPB(defaultPB);
  }, [phongBanDA, dataQuy]);

  const toggleTodo = async (item, index) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionQuanlyTaisan.findIndex(
      (existingItem) => existingItem.ID_PhieuNX === item.ID_PhieuNX
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionQuanlyTaisan((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionQuanlyTaisan([item]);
    }
  };

  const handleQuanLyTaiSan = (item) => {
    setPhieuNXContext(item);
    saveStep(1);
    navigation.navigate("ScanScreen");
  };

  const handleAlertClose = (item) => {
    Alert.alert("SMAC Thông báo", "Bạn có thực sự  muốn khóa phiếu không?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => handleClosePhieu(item) },
    ]);
  };

  const handleClosePhieu = async (item) => {
    await axios
      .put(BASE_URL_ASSETS + `/tb_phieunx/close-fast/${item.ID_PhieuNX}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authTokenAsset}`,
        },
      })
      .then((res) => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "S.M.A.C ",
          textBody: "Khóa phiếu kiểm kê thành công",
          autoClose: 2000,
        });
        setNewActionQuanlyTaisan([]);
        setPhieuNX((prevPhieuNX) =>
          prevPhieuNX.filter((phieu) => phieu.ID_PhieuNX !== item.ID_PhieuNX)
        );
      })
      .catch((error) => {
        
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "S.M.A.C ",
          textBody: "Khóa phiếu kiểm kê thất bại",
        });
      });
  };

  const handlePushDataSave = async () => {
   
    if (!dataInput.ID_Phongban || !dataInput.ID_Quy || !dataInput.Sophieu) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "S.M.A.C ",
        textBody: "Phải nhập đầy đủ dữ liệu",
        autoClose: 2000,
      });
    } else {
      setLoadingSubmit(true);
      const data = {
        ID_Nghiepvu: 7,
        ID_NoiNhap: dataInput.ID_Phongban,
        ID_NoiXuat: dataInput.ID_Phongban,
        NgayNX: dataInput.NgayNX,
        ID_Quy: dataInput.ID_Quy,
        Sophieu: dataInput.Sophieu,
        Ghichu: dataInput.Ghichu || "",
      };
      await axios
        .post(BASE_URL_ASSETS + `/tb_phieunx/create`, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authTokenAsset}`,
          },
        })
        .then((res) => {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "S.M.A.C ",
            textBody: "Tạo phiếu kiểm kê thành công",
            autoClose: 2000,
          });
          setLoadingSubmit(false);
          setPhieuNX([res.data.data]);
         
        })
        .catch((error) => {
          console.log('err', error)
          setLoadingSubmit(false);
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "S.M.A.C ",
            textBody: "Tạo phiếu kiểm kê thất bại",
          });
        });
    }
  };

  function formatDate(inputDate) {
    // Extract day, month, and year from the input date
    var dateObject = new Date(inputDate);
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1; // Add 1 because January is 0
    var year = dateObject.getFullYear();

    // Pad day and month with leading zeros if necessary
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    // Return the formatted date
    return year + "-" + month + "-" + day;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#E7E7E7" }}>
      <AlertNotificationRoot theme="light">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={height}
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
          >
            <BottomSheetModalProvider>
              {loading === true ? (
                <>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color={"gray"} />
                  </View>
                </>
              ) : (
                <>
                  {phieuNX && phieuNX.length > 0 ? (
                    <FlatList
                      horizontal={false}
                      contentContainerStyle={{ flexGrow: 1 }}
                      style={{ marginVertical: 10 }}
                      data={phieuNX}
                      renderItem={({ item, index }) => (
                        <ItemPhieuNhapXuat
                          key={index}
                          item={item}
                          toggleTodo={toggleTodo}
                          newActionQuanlyTaisan={newActionQuanlyTaisan}
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      scrollEventThrottle={16}
                      scrollEnabled={true}
                    />
                  ) : (
                    <View style={{ margin: 20 }}>
                      <View
                        style={{
                          justifyContent: "space-around",
                          width: "100%",
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Phòng ban dự án
                        </Text>

                        <SelectDropdown
                          data={phongBanDA ? phongBanDA : []}
                          buttonStyle={styles.select}
                          dropdownStyle={{
                            borderRadius: 8,
                            maxHeight: 400,
                          }}
                          // rowStyle={{ height: adjust(50), justifyContent: "center" }}
                          defaultButtonText={"Nơi nhập xuất"}
                          buttonTextStyle={styles.customText}
                          defaultValue={defaultPB}
                          onSelect={(selectedItem, index) => {
                            handleChangeText(
                              "ID_Phongban",
                              selectedItem.ID_Phongban
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
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignContent: "center",
                                  height: adjust(50),
                                }}
                              >
                                <Text
                                  allowFontScaling={false}
                                  style={styles.text}
                                >
                                  {selectedItem?.Tenphongban}
                                </Text>
                              </View>
                            );
                          }}
                          renderCustomizedRowChild={(item, index) => {
                            return (
                              <VerticalSelect
                                value={item.ID_Phongban}
                                label={item.Tenphongban}
                                key={index}
                                selectedItem={phongBanDA}
                              />
                            );
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ width: "48%" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            Ngày nhập xuất
                          </Text>
                          <TouchableOpacity onPress={toggleDatePicker}>
                            <View style={styles.action}>
                              <TextInput
                                allowFontScaling={false}
                                value={dataInput.NgayNX}
                                placeholder="Ngày nhập xuất"
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
                                <AntDesign
                                  name="calendar"
                                  size={24}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </View>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              isDarkModeEnabled={true}
                              onConfirm={(date) => handleConfirm("NgayNX", date)}
                              onCancel={toggleDatePicker}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: "48%" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            Quý
                          </Text>

                          <SelectDropdown
                            data={dataQuy ? dataQuy : []}
                            buttonStyle={styles.select}
                            dropdownStyle={{
                              borderRadius: 8,
                              maxHeight: 400,
                            }}
                            // rowStyle={{ height: 50, justifyContent: "center" }}
                            defaultButtonText={"Chọn quý"}
                            buttonTextStyle={styles.customText}
                            defaultValue={defaultQuy}
                            onSelect={(selectedItem, index) => {
                              handleChangeText("ID_Quy", selectedItem.value);
                            }}
                            renderDropdownIcon={(isOpened) => {
                              return (
                                <FontAwesome
                                  name={
                                    isOpened ? "chevron-up" : "chevron-down"
                                  }
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
                                  selectedItem={dataInput.ID_Quy}
                                />
                              );
                            }}
                          />
                        </View>
                      </View>

                      <View>
                        <Text allowFontScaling={false} style={styles.text}>
                          Mã số phiếu
                        </Text>
                        <TextInput
                          allowFontScaling={false}
                          value={dataInput.Sophieu}
                          placeholder="Mã số phiếu"
                          placeholderTextColor="gray"
                          style={[
                            styles.textInput,
                            {
                              paddingHorizontal: 10,
                            },
                          ]}
                          onChangeText={(val) => {
                            handleChangeText("Sophieu", val);
                          }}
                        />
                      </View>

                      <View>
                        <Text allowFontScaling={false} style={styles.text}>
                          Ghi chú
                        </Text>
                        <TextInput
                          allowFontScaling={false}
                          value={dataInput.Ghichu}
                          placeholder="Ghi chú"
                          placeholderTextColor="gray"
                          textAlignVertical="top"
                          multiline={true}
                          blurOnSubmit={false}
                          style={[
                            styles.textInput,
                            {
                              paddingHorizontal: 10,
                              height: 80,
                            },
                          ]}
                          onChangeText={(text) => {
                            handleChangeText("Ghichu", text);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "space-around",
                          width: "100%",
                          marginTop: 20,
                        }}
                      >
                        <ButtonSubmit
                          text={"Lưu"}
                          width={"auto"}
                          backgroundColor={COLORS.bg_active}
                          color={"white"}
                          isLoading={loadingSubmit}
                          onPress={() => handlePushDataSave()}
                        />
                      </View>
                    </View>
                  )}
                </>
              )}

              {newActionQuanlyTaisan?.length > 0 && (
                <View
                  style={{
                    width: 60,
                    position: "absolute",
                    right: 30,
                    bottom: 60,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {newActionQuanlyTaisan[0]?.iTinhtrang === 0 && (
                    <>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() =>
                          handleAlertClose(newActionQuanlyTaisan[0])
                        }
                      >
                        <Entypo name="lock" size={adjust(40)} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() =>
                          handleQuanLyTaiSan(newActionQuanlyTaisan[0])
                        }
                      >
                        <Entypo
                          name="chevron-right"
                          size={adjust(40)}
                          color="white"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </BottomSheetModalProvider>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </AlertNotificationRoot>
    </GestureHandlerRootView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },
  modalView: {
    margin: 20,
    borderRadius: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10,
  },
  customText: {
    fontWeight: "600",
    fontSize: adjust(15),
  },
  modalViewInfo: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  headerModal: {
    width: "100%",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    alignItems: "center",
    padding: 10,
  },

  textModal: {
    color: "#21409A",
    paddingBottom: 4,
    fontWeight: "500",
  },

  image: {
    width: "90%",
    height: 160,
    resizeMode: "contain",
    marginVertical: 10,
  },
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    // paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  textInput: {
    color: "#05375a",
    fontSize: adjust(15),
    borderRadius: 8,
    height: 48,
    paddingVertical: 4,
    backgroundColor: "white",
    width: "100%",
  },
  select: {
    width: "100%",
    borderRadius: 8,
    height: 48,
    backgroundColor: "white",
  },
  action: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: COLORS.bg_active,
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
