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
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";

import {
  ent_khuvuc_get,
  ent_hangmuc_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import ItemHangmuc from "../../components/Item/ItemHangmuc";
import ModalHangmuc from "../../components/Modal/ModalHangmuc";

const DanhmucHangmuc = ({ navigation }) => {
  const dispath = useDispatch();
  const { ent_khuvuc, ent_hangmuc } = useSelector((state) => state.entReducer);
  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [opacity, setOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    ID_Hangmuc: null,
  });

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const init_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  useEffect(() => {
    init_khuvuc();
    init_hangmuc();
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
    ID_Khuvuc: null,
    MaQrCode: "",
    Hangmuc: "",
    Tieuchuankt: "",
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.Tieuchuankt === "" || dataInput.Hangmuc === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin hạng mục", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Khuvuc: dataInput.ID_Khuvuc,
        MaQrCode: dataInput.MaQrCode,
        Hangmuc: dataInput.Hangmuc,
        Tieuchuankt: dataInput.Tieuchuankt,
      };
      setLoadingSubmit(true);
      try {
        const response = await axios.post(
          BASE_URL_CHECKLIST + "/ent_hangmuc/create",
          data,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenChecklist,
            },
          }
        );
        init_hangmuc();
        handleAdd();
        handleCloseModal();
        handlePresentModalClose();
        setLoadingSubmit(false);
        Alert.alert("PMC Thông báo", response.data.message, [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      } catch (error) {
        setLoadingSubmit(false);

        if (error.response) {
          // Lỗi từ phía server (có response từ server)
          Alert.alert("PMC Thông báo", error.response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else if (error.request) {
          // Lỗi không nhận được phản hồi từ server
          Alert.alert("PMC Thông báo", "Không nhận được phản hồi từ máy chủ", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          // Lỗi khi cấu hình request
          Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
    }
  };

  const handleEditEnt = (data) => {
    setIsCheckUpdate({
      check: true,
      ID_Hangmuc: data.ID_Hangmuc,
    });
    handlePresentModalPress();
    setDataInput({
      ID_Khuvuc: data.ID_Khuvuc,
      MaQrCode: data.MaQrCode,
      Hangmuc: data.Hangmuc,
      Tieuchuankt: data.Tieuchuankt,
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.Tieuchuankt === "" || dataInput.Hangmuc === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin hạng mục", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Khuvuc: dataInput.ID_Khuvuc,
        MaQrCode: dataInput.MaQrCode,
        Hangmuc: dataInput.Hangmuc,
        Tieuchuankt: dataInput.Tieuchuankt,
      };
      setLoadingSubmit(true);
      try {
        await axios
          .put(BASE_URL_CHECKLIST + `/ent_hangmuc/update/${id}`, data, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenChecklist,
            },
          })
          .then((response) => {
            init_hangmuc();
            handleAdd();
            handleCloseModal();
            handlePresentModalClose();
            setLoadingSubmit(false);
            Alert.alert("PMC Thông báo", response.data.message, [
              {
                text: "Hủy",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
            ]);
          });
      } catch (error) {
        setLoadingSubmit(false);
        if (error.response) {
          // Lỗi từ phía server (có response từ server)
          Alert.alert("PMC Thông báo", error.response.data.message, [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else if (error.request) {
          // Lỗi không nhận được phản hồi từ server
          Alert.alert("PMC Thông báo", "Không nhận được phản hồi từ máy chủ", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        } else {
          // Lỗi khi cấu hình request
          Alert.alert("PMC Thông báo", "Lỗi khi gửi yêu cầu", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
    }
  };

  const handleAlertDelete = async (id) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa hạng mục làm việc", [
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
      .put(BASE_URL_CHECKLIST + `/ent_hangmuc/delete/${id}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      })
      .then((response) => {
        init_hangmuc();
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

  const handleAdd = () => {
    setDataInput({
      ID_Khuvuc: null,
      MaQrCode: "",
      Hangmuc: "",
      Tieuchuankt: "",
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentModalClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      handleCloseModal();
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleCloseModal = () => {
    setOpacity(1);
    setIsCheckUpdate({
      check: false,
      ID_Hangmuc: null,
    });
    setDataInput({
      ID_Khuvuc: null,
      MaQrCode: "",
      Hangmuc: "",
      Tieuchuankt: "",
    });
    bottomSheetModalRef.current?.close();
  };

  const decimalNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`;
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
                        Danh mục hạng mục
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
                      {ent_hangmuc && ent_hangmuc.length > 0 ? (
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
                                Số lượng: {decimalNumber(ent_hangmuc?.length)}
                              </Text>
                              <ButtonChecklist
                                text={"Thêm mới"}
                                width={"auto"}
                                color={COLORS.bg_button}
                                onPress={handlePresentModalPress}
                              />
                            </View>
                          </TouchableWithoutFeedback>
                          <FlatList
                            horizontal={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={{ marginVertical: 10 }}
                            data={ent_hangmuc}
                            renderItem={({ item, index }) => (
                              <ItemHangmuc
                                key={index}
                                item={item}
                                handleEditEnt={handleEditEnt}
                                handleAlertDelete={handleAlertDelete}
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
                  <ModalHangmuc
                    ent_khuvuc={ent_khuvuc}
                    ent_hangmuc={ent_hangmuc}
                    handleChangeText={handleChangeText}
                    dataInput={dataInput}
                    handlePushDataSave={handlePushDataSave}
                    isCheckUpdate={isCheckUpdate}
                    handlePushDataEdit={handlePushDataEdit}
                    loadingSubmit={loadingSubmit}
                  />
                </View>
              </BottomSheetModal>
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
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
});

export default DanhmucHangmuc;
