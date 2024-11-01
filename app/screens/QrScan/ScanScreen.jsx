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
  Button,
  FlatList,
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
import { el } from "date-fns/locale";
import CheckboxNew from "../../components/Checkbox/CheckboxNew";

const ScanScreen = () => {
  const { step, saveStep, phieuNXContext } = useContext(ScanContext);

  const { userAsset, authTokenAsset } = useSelector(
    (state) => state.authReducer
  );

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [modalVisibleDs, setModalVisibleDs] = useState(false);
  const [modalVisisbleTaiSan, setModalVisibleTaiSan] = useState(false);
  const [image, setImage] = useState();
  const [note, setNote] = useState("");

  const [taisan, setTaiSan] = useState(null);
  const [taisanFind, setTaiSanFind] = useState(null);
  const [taisanQr, setTaiSanQr] = useState(null);
  const [dataTaiSanDetail, setDataTaiSanDetail] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isCodeSelected, setIsCodeSelected] = useState(true);
  const [soluong, setSoluong] = useState(0);

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
      const sl = dataTaiSanDetail.ID_TaisanQrcode == null ? soluong : 1;
      if (sl <= 0) {
        Alert.alert("PMC Thông báo", "Vui lòng nhập số lượng để kiểm kê", [
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
        setLoadingSubmit(false);
        return;
      }

      const formData = new FormData();
      const fields = {
        ID_Phongban: phieuNXContext?.ID_Phongban,
        ID_Nam: phieuNXContext?.ID_Nam,
        ID_Quy: phieuNXContext?.ID_Quy,
        Dongia: dataTaiSanDetail.Giatri || 0,
        Soluong: soluong,
        Namsx: dataTaiSanDetail?.ID_Nam,
        ID_PhieuNX: phieuNXContext.ID_PhieuNX,
        ID_Taisan: dataTaiSanDetail.ID_Taisan,
        ID_TaisanQrcode: dataTaiSanDetail.ID_TaisanQrcode || null,
        MaQrCode: dataTaiSanDetail?.MaQrCode,
      };

      Object.keys(fields).forEach((key) => {
        formData.append(key, fields[key]);
      });

      if (image) {
        const file = {
          uri:
            Platform.OS === "android"
              ? image.uri
              : image.uri.replace("file://", ""),
          name:
            image.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
          type: image.type || "image/jpeg",
        };
        formData.append("Image", file);
      }

      // Gửi yêu cầu POST
      await axios.post(`${BASE_URL_ASSETS}/tb_phieunxct/scan`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authTokenAsset}`,
        },
      });

      // Xử lý thành công
      setLoadingSubmit(false);
      toggleModalTaiSanQr(false, 1);
      clearDataModal();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "S.M.A.C ",
        textBody: "Kiểm kê tài sản thành công",
      });
    } catch (error) {
      setLoadingSubmit(false);
      console.error("Error during asset check:", error);
      Alert.alert(
        "PMC Thông báo",
        error.response?.data?.message || "Đã xảy ra lỗi",
        [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
      );
    }
  };

  useEffect(() => {
    const fetchDataTaiSan = async () => {
      const data = {
        ID_Loainhom: phieuNXContext.ID_Loainhom,
        ID_Nghiepvu: phieuNXContext.ID_Nghiepvu,
        ID_NoiNhap: phieuNXContext.ID_NoiNhap,
        ID_NoiXuat: phieuNXContext.ID_NoiXuat,
        ID_Quy: phieuNXContext.ID_Quy,
        ID_Nam: phieuNXContext.ID_Nam,
      };

      try {
        const res = await axios.post(
          BASE_URL_ASSETS + `/tb_phieunx/taisan`,
          data,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authTokenAsset}`,
            },
          }
        );

        if (res.status === 200) {
          const data = res.data.data;
          const mangCoMaQrCode = [];
          const mangKhongCoMaQrCode = [];

          data.forEach((item) => {
            if (item.MaQrCode !== null) {
              mangCoMaQrCode.push(item);
            } else {
              mangKhongCoMaQrCode.push(item);
            }
          });
          setTaiSanQr(mangCoMaQrCode);
          setTaiSan(data);
        } else {
          setTaiSanQr(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTaiSanQr(null);
      }
    };

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
        setSoluong(0);
      } else {
        Alert.alert(
          "PMC Thông báo",
          "Sản phẩm không thuộc phòng ban này hoặc không có trong danh sách cần kiểm kê",
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
        clearDataModal();
        saveStep(1);
      }
    }
  };

  const handleCheckCode = () => {
    const cleanedValue = inputValue
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();

    let resData;

    if (isCodeSelected) {
      resData = taisanQr.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
    } else {
      resData = taisan.filter(
        (item) => item.ent_taisan.Tents.trim().toLowerCase() === cleanedValue
      );
    }
    if (resData.length == 1) {
      setDataTaiSanDetail(resData[0]);
      setModalVisibleQr(false);
      setModalVisibleTaiSan(true);
      setOpacity(0.4);
      saveStep(2);
      setSoluong(0);
    } else if (resData.length > 1) {
      setTaiSanFind(resData);
      setOpacity(0.4);
      setModalVisibleDs(true);
    } else {
      Alert.alert(
        "PMC Thông báo",
        "Sản phẩm không thuộc phòng ban này hoặc không có trong danh sách cần kiểm kê",
        [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
    }
  };

  const handleItemPress = (item) => {
    setDataTaiSanDetail(item);
    setModalVisibleDs(false);
    setModalVisibleTaiSan(true);
    setOpacity(0.4);
    saveStep(2);
    setSoluong(0);
  };

  const renderDetailRow = (label, value, isInput = false) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <Text style={{ width: 100, fontWeight: "600" }}>{label}</Text>
      <Text>:</Text>
      {isInput ? (
        <TextInput
          style={{
            height: 40,
            width: 200,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            marginLeft: 5,
            paddingHorizontal: 10,
            backgroundColor: "#FFFFFF",
            fontSize: 16,
          }}
          placeholder="0"
          placeholderTextColor="#A9A9A9"
          value={soluong}
          onChangeText={setSoluong}
          keyboardType="numeric"
        />
      ) : (
        <Text
          style={{
            flexShrink: 1,
            marginLeft: 5,
            flexWrap: "wrap",
            maxWidth: "70%",
          }}
        >
          {value}
        </Text>
      )}
    </View>
  );

  const formatValue = (value, currency = "VND") => {
    return (
      value?.toLocaleString("it-IT", {
        style: "currency",
        currency,
      }) || "0"
    );
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
                  <View
                    style={{ alignItems: "center", flex: 1, marginTop: "10%" }}
                  >
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
                      Ấn vào <Text style={{ fontWeight: "800" }}>Qr Code</Text>{" "}
                      để <Text style={{ fontWeight: "800" }}>Quét</Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "400",
                        paddingTop: 10,
                        textAlign: "center",
                      }}
                    >
                      Hoặc nhập mã{" "}
                      <Text style={{ fontWeight: "800" }}>Qr Code</Text> (hoặc
                      tên tài sản) để{" "}
                      <Text style={{ fontWeight: "800" }}>Kiểm tra</Text>
                    </Text>
                    <TextInput
                      style={{
                        height: adjust(40),
                        width: adjust(300),
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: "#FFFFFF",
                      }}
                      placeholder="Nhập mã (tên tài sản) tại đây"
                      placeholderTextColor="#A9A9A9"
                      value={inputValue}
                      onChangeText={setInputValue}
                      keyboardType="default"
                    />
                    <View style={{ flexDirection: "row", marginTop: 10, gap: 16 }}>
                      <CheckboxNew
                        title="Mã"
                        checked={isCodeSelected}
                        onPress={() => setIsCodeSelected(true)}
                        color="blue"
                      />
                      <CheckboxNew
                        title="Tên"
                        checked={!isCodeSelected}
                        onPress={() => setIsCodeSelected(false)}
                        color="blue"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={handleCheckCode}
                      style={{
                        backgroundColor: "#007BFF",
                        borderRadius: 5,
                        marginTop: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        alignSelf: "center",
                      }}
                    >
                      <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                        Kiểm tra
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDs}
                onRequestClose={() => {
                  setModalVisibleDs(false);
                  clearDataModal();
                  saveStep(1);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Danh sách Tài sản</Text>
                    <FlatList
                      data={taisanFind}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleItemPress(item)}>
                          <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle}>
                              Tên tài sản: {item.ent_taisan.Tents}
                            </Text>
                            <Text style={styles.itemCode}>
                              Mã QR: {item.MaQrCode}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.ID_TaisanQrcode.toString()}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisibleDs(false);
                        setOpacity(1);
                      }}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

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
                <TouchableWithoutFeedback
                  onPress={Keyboard.dismiss}
                  accessible={false}
                >
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                  >
                    {dataTaiSanDetail?.MaQrCode !== null ? (
                      //tài sản có qr code
                      <View style={[styles.centeredView]}>
                        <View
                          style={[
                            styles.modalViewInfo,
                            {
                              width: "85%",
                              height: "auto",
                              position: "relative",
                            },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              toggleModalTaiSanQr(false, 1);
                              clearDataModal();
                            }}
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              zIndex: 100,
                            }}
                          >
                            <AntDesign
                              name="closecircle"
                              size={36}
                              color="red"
                            />
                          </TouchableOpacity>
                          <View style={styles.headerModal}>
                            <Text
                              allowFontScaling={false}
                              style={styles.textModal}
                            >
                              Xác nhận thông tin
                            </Text>
                          </View>
                          <View style={{ paddingVertical: 10 }}>
                            {renderDetailRow(
                              "Mã tài sản",
                              dataTaiSanDetail?.ent_taisan?.Mats
                            )}
                            {renderDetailRow(
                              "Mã QrCode",
                              dataTaiSanDetail?.MaQrCode
                            )}
                            {renderDetailRow(
                              "Tên tài sản",
                              dataTaiSanDetail?.ent_taisan?.Tents
                            )}
                            {renderDetailRow(
                              "Ngày khởi tạo",
                              formatDate(dataTaiSanDetail?.Ngaykhoitao)
                            )}
                            {renderDetailRow(
                              "Giá trị",
                              formatValue(dataTaiSanDetail?.Giatri)
                            )}
                            {renderDetailRow(
                              "Tình trạng",
                              dataTaiSanDetail?.iTinhtrang === 0
                                ? "Sử dụng"
                                : "Không sử dụng"
                            )}
                            {renderDetailRow(
                              "Người dùng",
                              dataTaiSanDetail?.ent_user?.Hoten || "Không có"
                            )}

                            {renderDetailRow(
                              "Phòng BAN",
                              `${dataTaiSanDetail?.ent_phongbanda?.Tenphongban} (${dataTaiSanDetail?.ent_phongbanda?.ent_chinhanh?.Tenchinhanh})`
                            )}
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
                    ) : (
                      // tài sản không có qr code
                      <View style={[styles.centeredView]}>
                        <View
                          style={[
                            styles.modalViewInfo,
                            {
                              width: "85%",
                              height: "auto",
                              position: "relative",
                            },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              toggleModalTaiSanQr(false, 1);
                              clearDataModal();
                            }}
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              zIndex: 100,
                            }}
                          >
                            <AntDesign
                              name="closecircle"
                              size={36}
                              color="red"
                            />
                          </TouchableOpacity>
                          <View style={styles.headerModal}>
                            <Text
                              allowFontScaling={false}
                              style={styles.textModal}
                            >
                              Xác nhận thông tin
                            </Text>
                          </View>
                          <View style={{ paddingVertical: 10 }}>
                            {renderDetailRow(
                              "Mã tài sản",
                              dataTaiSanDetail?.ent_taisan?.Mats
                            )}
                            {renderDetailRow(
                              "Tên tài sản",
                              dataTaiSanDetail?.ent_taisan?.Tents
                            )}
                            {renderDetailRow(
                              "Phòng ban",
                              `${dataTaiSanDetail?.ent_phongbanda?.Tenphongban} (${dataTaiSanDetail?.ent_phongbanda?.ent_chinhanh?.Tenchinhanh})`
                            )}
                            {renderDetailRow("Số lượng", null, true)}
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
                    )}
                  </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
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
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 16,
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
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemCode: {
    fontSize: 14,
    color: "#555",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
});
