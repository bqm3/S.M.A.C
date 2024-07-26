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
  import SelectDropdown from "react-native-select-dropdown";
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
    const { step, saveStep } = useContext(ScanContext);
  
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
        formData.append("iTinhtrang", 1);
        formData.append("Ghichu", note);
  
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
        await axios.put(
          BASE_URL_ASSETS +
            `/tb_taisanqrcode/scan/${dataTaiSanDetail.ID_TaisanQr}`,
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

    useEffect(()=> {
        const resDataNghiepVu = async () => {
            await axios.get("https://checklist.pmcweb.vn/pmc-assets/api/ent_nghiepvu/all")
            .then((res)=> console.log('res',res.data.data))
            .catch((err)=> console.log('err', err))
        }
        resDataNghiepVu()
    },[])

    useEffect(()=> {
        const resDataPhongbanda = async () => {
            await axios.get("https://checklist.pmcweb.vn/pmc-assets/api/ent_phongbanda/all")
            .then((res)=> console.log('res',res.data.data))
            .catch((err)=> console.log('err', err))
        }
        resDataPhongbanda()
    },[])
  
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <AlertNotificationRoot>
              <BottomSheetModalProvider>
              <View style={{ margin: 20 }}>
            <View style={{ justifyContent: "space-around", width: "100%" }}>
              <Text allowFontScaling={false} style={styles.text}>
                Khối công việc
              </Text>

              {/* <SelectDropdown
                data={ent_khoicv ? ent_khoicv : []}
                buttonStyle={styles.select}
                dropdownStyle={{
                  borderRadius: 8,
                  maxHeight: 400,
                }}
                // rowStyle={{ height: adjust(50), justifyContent: "center" }}
                defaultButtonText={"Khối công việc"}
                buttonTextStyle={styles.customText}
                defaultValue={defaultKhoi}
                onSelect={(selectedItem, index) => {
                  handleChangeText("khoicv", selectedItem.ID_Khoi);
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
                      selectedItem={dataInput.khoicv}
                    />
                  );
                }}
              /> */}
              
            </View>
            {/* <View style={{ marginTop: 20 }}>
              <ButtonSubmit
                text={isCheckUpdate.check ? "Cập nhật" : "Lưu"}
                width={"auto"}
                color={"white"}
                backgroundColor={COLORS.bg_button}
                isLoading={loadingSubmit}
                onPress={
                  isCheckUpdate.check
                    ? () => handlePushDataEdit(isCheckUpdate.id_calv)
                    : () => handlePushDataSave()
                }
              />
            </View> */}
          </View>
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
  