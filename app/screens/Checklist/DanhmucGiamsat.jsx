import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ItemCalamviec from "../../components/Item/ItemCalamviec";

import {
  ent_chucvu_get,
  ent_giamsat_get,
  ent_duan_get,
  ent_khoicv_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import ModalCalamviec from "../../components/Modal/ModalCalamviec";
import ItemGiamSat from "../../components/Item/ItemGiamSat";
import ModalGiamsat from "../../components/Modal/ModalGiamsat";
import ModalGiamsatInfo from "../../components/Modal/ModalGiamsatInfo";

const DanhmucGiamsat = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_giamsat, ent_chucvu, ent_duan, ent_khoicv } = useSelector(
    (state) => state.entReducer
  );
  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    ID_Giamsat: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const init_duan = async () => {
    await dispath(ent_duan_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_chucvu = async () => {
    await dispath(ent_chucvu_get());
  };

  const init_giamsat = async () => {
    await dispath(ent_giamsat_get());
  };

  useEffect(() => {
    init_giamsat();
    init_duan();
    init_chucvu();
    init_khoicv();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); //

  const [dataInput, setDataInput] = useState({
    ID_Duan: userChecklist.ID_Duan,
    hoten: "",
    gioitinh: "",
    ngaysinh: "",
    sodienthoai: "",
    ID_Chucvu: 2,
    ID_Quyen: null,
    ID_KhoiCV: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.hoten === "" || dataInput.sodienthoai === null) {
      Alert.alert("PMC Thông báo", "Thiếu thông tin người giám sát", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Duan: userChecklist.ID_Duan,
        Hoten: dataInput.hoten,
        Gioitinh: dataInput.gioitinh,
        Sodienthoai: dataInput.sodienthoai,
        Ngaysinh: dataInput.ngaysinh,
        ID_Chucvu: dataInput.ID_Chucvu,
        ID_KhoiCV: dataInput.ID_KhoiCV,
        iQuyen: 1,
      };
      setLoadingSubmit(true);
      await axios
        .post(BASE_URL_CHECKLIST + "/ent_giamsat/create", data, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authTokenChecklist,
          },
        })
        .then((response) => {
          init_giamsat();
          handleAdd();
          handleCloseModal();
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
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

  const handleEditEnt = async (data) => {
    handlePresentModalPress();
    setDataInput({
      ID_Duan: userChecklist.ID_Duan,
      hoten: data.Hoten,
      gioitinh: data.Gioitinh,
      ngaysinh: data.Ngaysinh,
      sodienthoai: data.Sodienthoai,
      ID_Chucvu: data.ID_Chucvu,
      ID_KhoiCV: data.ID_KhoiCV,
      ID_Quyen: data.iQuyen,
    });

    setIsCheckUpdate({
      check: true,
      ID_Giamsat: data.ID_Giamsat,
    });
  };

  const handlePushDataEdit = async () => {
    if (dataInput.hoten === "" || dataInput.sodienthoai === null) {
      Alert.alert("PMC Thông báo", "Thiếu thông tin ca làm việc", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Duan: userChecklist.ID_Duan,
        Hoten: dataInput.hoten,
        Gioitinh: dataInput.gioitinh,
        Sodienthoai: dataInput.sodienthoai,
        Ngaysinh: dataInput.ngaysinh,
        ID_Chucvu: dataInput.ID_Chucvu,
        ID_KhoiCV: dataInput.ID_KhoiCV,
        iQuyen: 1,
      };
      setLoadingSubmit(true);

      await axios
        .put(
          BASE_URL_CHECKLIST + `/ent_giamsat/update/${isCheckUpdate.ID_Giamsat}`,
          data,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenChecklist,
            },
          }
        )
        .then((response) => {
          init_giamsat();
          handleAdd();
          handleCloseModal();
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((err) => {
          console.log("err", err.response.data.message);
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        });
    }
  };

  const handleAlertDelete = async (id) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa người giám sát", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => handlePushDataDelete(id) },
    ]);
  };

  const handlePushDataDelete = async (id) => {
    await axios
      .put(BASE_URL_CHECKLIST + `/ent_giamsat/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      })
      .then((response) => {
        init_giamsat();
        handleAdd();
        handleCloseModal();
        Alert.alert("PMC Thông báo", response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((err) => {
        Alert.alert("PMC Thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      });
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleConfirm = (key, date) => {
    const dateF = formatDate(date);
    handleChangeText(key, dateF);
    setDatePickerVisibility(false);
  };

  const handleAdd = () => {
    setDataInput({
      ID_Duan: userChecklist.ID_Duan,
      hoten: "",
      gioitinh: "",
      ngaysinh: "",
      sodienthoai: "",
      ID_Chucvu: 2,
      ID_Quyen: null,
      ID_KhoiCV: null,
    });
    setIsCheckUpdate({
      check: false,
      ID_Giamsat: null,
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
      handleAdd();
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleToggleModal = (isCheck, data, opacity) => {
    setDataModal(data);
    setModalVisible(isCheck);
    setOpacity(Number(opacity));
  };

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const decimalNumber = (number) => {
    if (number < 10) return `0${number}`;
    return number;
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/images/background_main.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  width: "100%",
                  opacity: opacity,
                }}
              >
                <View style={styles.container}>
                  <TouchableWithoutFeedback onPress={() => handleCloseModal()}>
                    <View style={{ width: "100%" }}>
                      <Text allowFontScaling={false} style={styles.danhmuc}>
                        Danh mục giám sát
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {isLoading === true ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 40,
                      }}
                    >
                      <ActivityIndicator size="large" color={"white"} />
                    </View>
                  ) : (
                    <>
                      {ent_giamsat && ent_giamsat.length > 0 ? (
                        <>
                          <TouchableWithoutFeedback
                            onPress={() => handleCloseModal()}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                allowFontScaling={false}
                                style={styles.text}
                              >
                                Số lượng: {decimalNumber(ent_giamsat?.length)}
                              </Text>
                              <ButtonChecklist
                                text={"Thêm mới"}
                                width={"auto"}
                                color={COLORS.bg_button}
                                // icon={<Ionicons name="add" size={20} color="white" />}
                                onPress={handlePresentModalPress}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                          <FlatList
                            horizontal={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={{ marginVertical: 10 }}
                            data={ent_giamsat}
                            renderItem={({ item, index }) => (
                              <ItemGiamSat
                                key={index}
                                item={item}
                                handleEditEnt={handleEditEnt}
                                handleAlertDelete={handleAlertDelete}
                                handleToggleModal={handleToggleModal}
                              />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEventThrottle={16}
                            ListFooterComponent={
                              <View style={{ height: 120 }} />
                            }
                            scrollEnabled={true}
                          />
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              marginBottom: 100,
                            }}
                          >
                            <Image
                              source={require("../../../assets/icons/delete_bg.png")}
                              resizeMode="contain"
                              style={{ height: 120, width: 120 }}
                            />
                            <Text
                              allowFontScaling={false}
                              style={[styles.danhmuc, { paddingVertical: 10 }]}
                            >
                              Bạn chưa thêm dữ liệu nào
                            </Text>
                            <ButtonChecklist
                              text={"Thêm mới"}
                              width={"auto"}
                              color={COLORS.bg_button}
                              onPress={handlePresentModalPress}
                            />
                          </View>
                        </>
                      )}
                    </>
                  )}
                </View>
              </View>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <View style={styles.contentContainer}>
                  <ModalGiamsat
                    ent_chucvu={ent_chucvu}
                    ent_duan={ent_duan}
                    ent_khoicv={ent_khoicv}
                    handleChangeText={handleChangeText}
                    isDatePickerVisible={isDatePickerVisible}
                    handleConfirm={handleConfirm}
                    toggleDatePicker={toggleDatePicker}
                    dataInput={dataInput}
                    handlePushDataSave={handlePushDataSave}
                    handleEditEnt={handleEditEnt}
                    isCheckUpdate={isCheckUpdate}
                    handlePushDataEdit={handlePushDataEdit}
                    loadingSubmit={loadingSubmit}
                  />
                </View>
              </BottomSheetModal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text allowFontScaling={false} style={styles.modalText}>
                      Thông tin cá nhân chi tiết
                    </Text>
                    <ModalGiamsatInfo
                      dataModal={dataModal}
                      handleToggleModal={handleToggleModal}
                    />
                  </View>
                </View>
              </Modal>
            </ImageBackground>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 36,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    marginTop: 10,
    height: 36,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default DanhmucGiamsat;
