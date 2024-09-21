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
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useContext } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";
import QRCodeScreen from "./QrCodeScreen";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import ButtonScan from "../../components/Button/ButtonScan";
import ScanContext from "../../context/ScanContext";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { BASE_URL_ASSETS } from "../../constants/config";

const ScanScreen = () => {
  const { step, saveStep,phieuNXContext } = useContext(ScanContext);

  const { userAsset, authTokenAsset } = useSelector(
    (state) => state.authReducer
  );

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [modalVisisbleTaiSan, setModalVisibleTaiSan] = useState(false);
  const [image, setImage] = useState();
  const [note, setNote] = useState("");

  const [taisanQr, setTaiSanQr] = useState([]);
  const [dataTaiSanDetail, setDataTaiSanDetail] = useState(null);

  const pickImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setImage(result?.assets[0]);
    }
  };

  const handleKiemketaisan = async () => {
    try {
      setLoadingSubmit(true);
      const formData = new FormData();
      formData.append("Dongia", dataTaiSanDetail.Giatri);
      formData.append("Namsx", dataTaiSanDetail.ID_Nam);
      formData.append("ID_PhieuNX", phieuNXContext.ID_PhieuNX);
      formData.append("ID_Taisan", dataTaiSanDetail.ID_Taisan);
      formData.append("ID_TaisanQrCode", dataTaiSanDetail.ID_TaisanQr);

      const file = {
        uri:
          Platform.OS === "android"
            ? image?.uri
            : image?.uri.replace("file://", ""),
        name:
          image?.fileName ||
          Math.floor(Math.random() * Math.floor(999999999)) + ".jpg",
        type: image?.type || "image/jpeg",
      };
      formData.append(`Image`, file);

      // debugger;
      await axios.post(
        BASE_URL_ASSETS +
          `/tb_phieunxct/scan`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokenAsset}`,
          },
        }
      );
      // debugger;
      setLoadingSubmit(false);
      toggleModalTaiSanQr(false, 1);
      clearDataModal();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "S.M.A.C ",
        textBody: "Kiểm kê tài sản thành công",
      });
    } catch (err) {
      setLoadingSubmit(false); // Đảm bảo setLoadingSubmit false trong trường hợp có lỗi
    }
  };

  useEffect(() => {
    async function fetchDataTaiSan() {
      const res = await axios.get(BASE_URL_ASSETS + "/tb_taisanqrcode/all");
      if (res.status == 200) {
        setTaiSanQr(res.data.data);
      } else {
        setTaiSanQr([]);
      }
    }
    fetchDataTaiSan();
  }, []);

  const toggleModalQr = (check, value) => {
    setModalVisibleQr(check);
    setOpacity(value);
  };

  const toggleModalTaiSanQr = (check, value) => {
    setModalVisibleTaiSan(check);
    setOpacity(value);
    setImage();
    setNote();
    saveStep(1);
  };

  const clearDataModal = () => {
    setImage();
    setNote();
    setDataTaiSanDetail();
    saveStep(1);
  };

  function formatDate(dateString) {
    // Check if dateString is defined and not null
    if (!dateString) {
      return ""; // or any default value you want to return in case of invalid input
    }

    // Split the input date string by the hyphen (-)
    let dateParts = dateString.split("-");

    // Rearrange the date parts to dd-mm-yyyy
    let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    return formattedDate;
  }

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();
    if (cleanedValue) {
      const resData = taisanQr.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData.length >= 1) {
        setDataTaiSanDetail(resData[0]);
        setModalVisibleQr(false);
        setModalVisibleTaiSan(true);
        setOpacity(0.4);
        saveStep(2);
      }
    } else {
      Alert.alert(
        "PMC Thông báo",
        "Sản phẩm không có trong danh sách cần kiểm kê",
        [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]
      );
      toggleModalQr(false, 1);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <AlertNotificationRoot>
            <BottomSheetModalProvider>
              <View
                style={[
                  styles.container,
                  {
                    opacity: opacity,
                    backgroundColor:
                      modalVisibleQr || modalVisisbleTaiSan ? "black" : "white",
                    zIndex: 10,
                  },
                ]}
              >
                {modalVisibleQr === false && modalVisisbleTaiSan === false && (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        toggleModalQr(true, 0.4), saveStep(2);
                      }}
                    >
                      <Image
                        style={{
                          width: adjust(300),
                          height: adjust(300),
                          resizeMode: "contain",
                        }}
                        source={require("../../../assets/images/scan.png")}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "400",
                        paddingTop: 10,
                        textAlign: "center",
                      }}
                    >
                      Ấn vào <Text style={{fontWeight: "800"}}>Qr Code</Text> để <Text style={{fontWeight: "800"}}>Quét</Text>
                    </Text>
                  </View>
                )}
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleQr}
                onRequestClose={() => {
                  toggleModalQr(false, 1);
                  clearDataModal();
                  saveStep(1);
                }}
              >
                {modalVisibleQr === true && (
                  <TouchableOpacity
                    onPress={() => {
                      toggleModalQr(false, 1);
                      clearDataModal();
                      saveStep(1);
                    }}
                    style={{
                      position: "relative",
                      top: 60,
                      left: 30,
                      zIndex: 100,
                      width: 40,
                    }}
                  >
                    <AntDesign name="closecircle" size={36} color="white" />
                  </TouchableOpacity>
                )}
                <View
                  style={[
                    styles.centeredView,
                    { width: "100%", height: "80%" },
                  ]}
                >
                  <View
                    style={[
                      styles.modalView,
                      { width: adjust(320), height: adjust(320) },
                    ]}
                  >
                    <QRCodeScreen
                      handlePushDataFilterQr={handlePushDataFilterQr}
                    />
                  </View>

                  <Text
                    style={{ color: "white", fontSize: 16, paddingTop: 10 }}
                  >
                    Hướng camera về phía mã qrcode
                  </Text>
                </View>
              </Modal>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisisbleTaiSan}
                onRequestClose={() => {
                  toggleModalTaiSanQr(false, 1);
                  clearDataModal();
                }}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1 }}
                >
                  {modalVisisbleTaiSan === true && (
                    <TouchableOpacity
                      onPress={() => {
                        toggleModalTaiSanQr(false, 1);
                        clearDataModal();
                      }}
                      style={{
                        position: "relative",
                        top: 60,
                        left: 30,
                        zIndex: 100,
                        width: 40,
                      }}
                    >
                      <AntDesign name="closecircle" size={36} color="white" />
                    </TouchableOpacity>
                  )}
                  <View style={[styles.centeredView]}>
                    <View
                      style={[
                        styles.modalViewInfo,
                        {
                          width: "85%",
                          height: "auto",
                        },
                      ]}
                    >
                      <View style={styles.headerModal}>
                        <Text allowFontScaling={false} style={styles.textModal}>
                          Xác nhận thông tin
                        </Text>
                      </View>
                      <View style={{ paddingVertical: 10 }}>
                        <Text
                          allowFontScaling={false}
                          style={[styles.textModal, { textAlign: "center" }]}
                        >
                          Thực hiện kiểm hàng{" "}
                          <Text style={{ fontWeight: "700" }}>
                            {dataTaiSanDetail?.ent_taisan?.Tents}
                          </Text>
                        </Text>

                        <View style={{ marginTop: 20 }}>
                          <View
                            style={{ flexDirection: "row", marginBottom: 10 }}
                          >
                            <Text style={{ width: 100, fontWeight: "600" }}>
                              Ngày khởi tạo
                            </Text>
                            <Text>:</Text>
                            <Text>
                              {" "}
                              {formatDate(dataTaiSanDetail?.Ngaykhoitao)}
                            </Text>
                          </View>
                          <View
                            style={{ flexDirection: "row", marginBottom: 10 }}
                          >
                            <Text style={{ width: 100, fontWeight: "600" }}>
                              Giá trị
                            </Text>
                            <Text>:</Text>
                            <Text>
                              {" "}
                              {dataTaiSanDetail?.Giatri.toLocaleString(
                                "it-IT",
                                {
                                  style: "currency",
                                  currency: "VND",
                                }
                              )}
                            </Text>
                          </View>
                          <View
                            style={{ flexDirection: "row", marginBottom: 10 }}
                          >
                            <Text style={{ width: 100, fontWeight: "600" }}>
                              Tình trạng
                            </Text>
                            <Text>:</Text>
                            <Text>
                              {" "}
                              {dataTaiSanDetail?.iTinhtrang === 0 && "Sử dụng"}
                            </Text>
                          </View>
                          <View
                            style={{ flexDirection: "row", marginBottom: 10 }}
                          >
                            <Text style={{ width: 100, fontWeight: "600" }}>
                              Người tạo
                            </Text>
                            <Text>:</Text>
                            <Text> {dataTaiSanDetail?.ent_user?.Hoten}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            <Text style={{ width: 100, fontWeight: "600" }}>
                              Phòng ban
                            </Text>
                            <Text>:</Text>
                            <Text style={{ flexShrink: 1, }}>
                              {" "}
                              {dataTaiSanDetail?.ent_phongbanda?.Tenphongban} (
                              {
                                dataTaiSanDetail?.ent_phongbanda?.ent_chinhanh
                                  .Tenchinhanh
                              }
                              )
                            </Text>
                          </View>
                        </View>
                      </View>

                      {image && (
                        <>
                          <Image
                            source={{ uri: image?.uri }}
                            style={styles.image}
                          />

                          <TextInput
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
                                marginBottom: 10,
                              },
                            ]}
                            onChangeText={setNote}
                            value={note}
                          />
                        </>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          marginHorizontal: 10,
                          gap: 20,
                        }}
                      >
                        <ButtonScan
                          width={"50%"}
                          text={image ? "Chụp ảnh lại" : "Chụp ảnh"}
                          backgroundColor={"#326BFF"}
                          color={"#FFFFFF"}
                          onPress={() => pickImage()}
                        />
                        {image ? (
                          <ButtonScan
                            width={"50%"}
                            text={"Xác nhận"}
                            backgroundColor={"#326BFF"}
                            color={"#FFFFFF"}
                            loading={loadingSubmit}
                            onPress={() => handleKiemketaisan()}
                          />
                        ) : (
                          <ButtonScan
                            width={"50%"}
                            text={"Đóng"}
                            backgroundColor={"#DCDEE9"}
                            color={"#7E7C7C"}
                            onPress={() => {
                              toggleModalTaiSanQr(false, 1);
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </Modal>
            </BottomSheetModalProvider>
          </AlertNotificationRoot>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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

  textInput: {
    color: "#05375a",
    fontSize: adjust(15),
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    height: 48,
    paddingVertical: 4,
    backgroundColor: "white",
    width: "100%",
  },
});
