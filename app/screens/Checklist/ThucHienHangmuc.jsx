import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import QRCodeScreen from "./QRCodeScreen";
import DataContext from "../../context/DataContext";
import adjust from "../../constants/adjust";

const ThucHienHangmuc = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Calv, ID_Khuvuc } = route.params;
  const dispath = useDispatch();
  const {
    setDataChecklists,
    dataChecklists,
    setHangMuc,
    hangMuc,
    HangMucDefault,
    setHangMucDefault,
  } = useContext(DataContext);
  const { ent_hangmuc } = useSelector((state) => state.entReducer);

  const [opacity, setOpacity] = useState(1);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tieuChuan, setTieuChuan] = useState();
  const [dataSelect, setDataSelect] = useState([]);

  useEffect(() => {
    if (HangMucDefault && dataChecklists) {
      // Lọc các mục có ID_Khuvuc trùng khớp
      const filteredByKhuvuc = HangMucDefault.filter(
        (item) => item.ID_Khuvuc === ID_Khuvuc
      );

      // Lấy danh sách ID_Hangmuc từ dataChecklists
      const checklistIDs = dataChecklists.map((item) => item.ID_Hangmuc);

      // Lọc filteredByKhuvuc để chỉ giữ lại các mục có ID_Hangmuc tồn tại trong checklistIDs
      const finalFilteredData = filteredByKhuvuc.filter((item) =>
        checklistIDs.includes(item.ID_Hangmuc)
      );

      // Cập nhật trạng thái hangMuc với danh sách đã lọc
      setHangMuc(finalFilteredData);
    }
  }, [ID_Khuvuc, HangMucDefault, dataChecklists]);

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();
    try {
      const resData = hangMuc.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData.length >= 1) {
        navigation.navigate("Chi tiết Checklist", {
          ID_ChecklistC: ID_ChecklistC,
          ID_KhoiCV: ID_KhoiCV,
          ID_Calv: ID_Calv,
          ID_Hangmuc: resData[0].ID_Hangmuc,
          hangMuc: hangMuc,
          ID_Khuvuc: ID_Khuvuc,
          Hangmuc: resData[0].Hangmuc,
        });
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      } else if (resData.length === 0) {
        Alert.alert(
          "PMC Thông báo",
          "Không tìm thấy hạng mục có mã Qr phù hợp",
          [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]
        );
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      }
    } catch (error) {
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
  };

  const toggleTodo = async (item) => {
    const isExistIndex = dataSelect.find(
      (existingItem) => existingItem === item
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex) {
      setDataSelect([]);
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setDataSelect([item]);
    }
  };

  const handlePopupActive = (item, index) => {
    setModalVisible(true);
    setOpacity(0.2);
    setTieuChuan(item.Tieuchuankt);
  };

  const handleSubmit = () => {
    navigation.navigate("Chi tiết Checklist", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Calv: ID_Calv,
      ID_Hangmuc: dataSelect[0].ID_Hangmuc,
      hangMuc: hangMuc,
      ID_Khuvuc: ID_Khuvuc,
      Hangmuc: dataSelect[0].Hangmuc,
    });
    setDataSelect([]);
    // Set the non-serializable values immediately after navigation
  };

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => toggleTodo(item)}
        style={[
          styles.content,
          {
            backgroundColor:
              dataSelect[0] === item ? COLORS.bg_button : "white",
          },
        ]}
        key={index}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "85%" }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(18),
                color: dataSelect[0] === item ? "white" : "black",
                fontWeight: "600",
              }}
              numberOfLines={5}
            >
              {item?.Hangmuc}
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(16),
                color: dataSelect[0] === item ? "white" : "black",
                fontWeight: "500",
              }}
            >
              {item?.MaQrCode}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
            <MaterialIcons name="read-more" size={adjust(30)} color="black" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // format number
  const decimalNumber = (number) => {
    if (number < 10 && number >= 1) return `0${number}`;
    if (number == 0) return `0`;
    return number;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../../assets/images/background_main.png")}
              resizeMode="cover"
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  opacity: opacity,
                }}
              >
                <View style={{ margin: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      // onPress={() => handleFilterData(true, 0.5)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "cloumn",
                          gap: 8,
                        }}
                      >
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {decimalNumber(hangMuc?.length)} hạng mục
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {isLoadingDetail === false &&
                  hangMuc &&
                  hangMuc?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={hangMuc}
                        renderItem={({ item, index, separators }) =>
                          renderItem(item, index)
                        }
                        ItemSeparatorComponent={() => (
                          <View style={{ height: 16 }} />
                        )}
                        keyExtractor={(item, index) =>
                          `${item?.ID_Checklist}_${index}`
                        }
                      />
                    </>
                  )}

                {isLoadingDetail === true && hangMuc?.length == 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator
                      style={{
                        marginRight: 4,
                      }}
                      size="large"
                      color={COLORS.bg_white}
                    ></ActivityIndicator>
                  </View>
                )}

                {isLoadingDetail === false && hangMuc?.length == 0 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 80,
                    }}
                  >
                    <Image
                      source={require("../../../assets/icons/delete_bg.png")}
                      resizeMode="contain"
                      style={{ height: 120, width: 120 }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.danhmuc, { padding: 10 }]}
                    >
                      {isScan
                        ? "Không thấy hạng mục cho khu vực này"
                        : "Không còn hạng mục cho ca làm việc này !"}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    position: "absolute",
                    bottom: 40,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {hangMuc.length > 0 && (
                    <Button
                      text={"Scan QR Code"}
                      backgroundColor={"white"}
                      color={"black"}
                      onPress={() => {
                        setModalVisibleQr(true);
                        setOpacity(0.2);
                      }}
                    />
                  )}

                  {dataSelect[0] && (
                    <Button
                      text={"Vào Checklist"}
                      isLoading={loadingSubmit}
                      backgroundColor={COLORS.bg_button}
                      color={"white"}
                      onPress={() => handleSubmit()}
                    />
                  )}
                </View>
              </View>
            </ImageBackground>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleQr}
              onRequestClose={() => {
                setModalVisibleQr(!modalVisibleQr);
                setOpacity(1);
              }}
            >
              <View
                style={[styles.centeredView, { width: "100%", height: "80%" }]}
              >
                <View
                  style={[styles.modalView, { width: "80%", height: "60%" }]}
                >
                  <QRCodeScreen
                    setModalVisibleQr={setModalVisibleQr}
                    setOpacity={setOpacity}
                    handlePushDataFilterQr={handlePushDataFilterQr}
                    setIsScan={setIsScan}
                  />
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
                setOpacity(1);
              }}
            >
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      width: "85%",
                      height: "65%",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <ScrollView>
                    <Text allowFontScaling={false}>{tieuChuan} </Text>
                  </ScrollView>
                  <Button
                    text={"Đóng"}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => {
                      setModalVisible(false);
                      setOpacity(1);
                    }}
                  />
                </View>
              </View>
            </Modal>
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ThucHienHangmuc;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(18), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "white",
    borderRadius: 16,
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
  modalText: {
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});
