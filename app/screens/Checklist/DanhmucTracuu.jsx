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
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  Linking,
  TouchableWithoutFeedback
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { WebView } from "react-native-webview";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import { COLORS, SIZES } from "../../constants/theme";
import {
  ent_tang_get,
  ent_khuvuc_get,
  ent_toanha_get,
  ent_khoicv_get,
} from "../../redux/actions/entActions";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import moment from "moment";
import ModalTracuu from "../../components/Modal/ModalTracuu";
import DanhmucThongKe from "./DanhmucThongKe";

const numberOfItemsPerPageList = [20, 30, 50];

const headerList = [
  {
    til: "Ngày kiểm tra",
    width: 120,
  },
  {
    til: "Checklist",
    width: 200,
  },
  {
    til: "Tên tòa nhà",
    width: 150,
  },
  {
    til: "Thuộc tầng",
    width: 150,
  },
  {
    til: "Thuộc khu vực",
    width: 150,
  },
  {
    til: "Thuộc bộ phận",
    width: 150,
  },
  {
    til: "Ca đầu",
    width: 150,
  },

  {
    til: "Nhân viên",
    width: 150,
  },
  {
    til: "Kết quả",
    width: 100,
  },
];

const DanhmucTracuu = () => {
  const dispath = useDispatch();
  const { ent_tang, ent_khuvuc, ent_toanha } = useSelector(
    (state) => state.entReducer
  );
  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const [data, setData] = useState([]);
  const [dataKhuvuc, setDataKhuvuc] = useState(ent_khuvuc);
  const [newActionCheckList, setNewActionCheckList] = useState([]);

  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalRef2 = useRef(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const snapPoints2 = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [isLoading, setIsLoading] = useState(false);

  const [isEnabled, setIsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const date = new Date();
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const endOfMonth = moment(date).format("YYYY-MM-DD");
  const [isShowChecklist, setIsShowChecklist] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    fromDate: false,
    toDate: false,
  });

  const [filters, setFilters] = useState({
    fromDate: startOfMonth,
    toDate: endOfMonth,
    ID_Toanha: null,
    ID_Khuvuc: null,
    ID_Tang: null,
  });

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_tang = async () => {
    await dispath(ent_tang_get());
  };

  useEffect(() => {
    setDataKhuvuc(ent_khuvuc);
  }, [ent_khuvuc]);

  const asyncKhuvuc = async () => {
    let data = {
      ID_Toanha: filters.ID_Toanha,
    };
    await axios
      .post(BASE_URL_CHECKLIST + `/ent_khuvuc/filter`, data, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      })

      .then((res) => {
        setDataKhuvuc(res.data.data);
      })
      .catch((error) => console.log("err", error.response.data.message));
  };

  useEffect(() => {
    asyncKhuvuc();
  }, [filters.ID_Toanha]);

  useEffect(() => {
    init_khuvuc();
    init_toanha();
    init_khoicv();
    init_tang();
  }, []);

  const toggleTodo = async (item) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) =>
        existingItem.ID_Checklistchitiet === item.ID_Checklistchitiet
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList([item]);
      const filter =
        item.Ketqua == item?.ent_checklist?.Giatridinhdanh &&
        item?.Ghichu == "" &&
        (item?.Anh == "" || item?.Anh === null)
          ? false
          : true;
      setIsShowChecklist(filter);
    }
  };

  const toggleDatePicker = (key, isCheck) => {
    setDatePickerVisibility((data) => ({
      ...data,
      [key]: isCheck,
    }));
  };

  const handleChangeFilters = (key, value) => {
    setFilters((data) => ({
      ...data,
      [key]: value,
    }));
    setIsEnabled(false);
  };

  const fetchData = async (filter) => {
    setIsLoading(true);
    await axios
      .post(
        BASE_URL_CHECKLIST +
          `/tb_checklistchitiet/filters?page=${page}&limit=${numberOfItemsPerPage}`,
        filter,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authTokenChecklist,
          },
        }
      )
      .then((res) => {
        setData(res.data);
        handlePresentModalClose();
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const fetchDataExcel = async () => {
    setIsLoading(true);
    await axios
      .post(BASE_URL_CHECKLIST + `/tb_checklistchitiet/excel-checklist`, data, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      })
      .then(async (res) => {
        const filePath = res.data.filePath;
        setIsLoading(false);
        const supported = await Linking.canOpenURL(filePath);

        if (supported) {
          await Linking.openURL(filePath);
        }
      })

      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData(filters);
  }, [page, numberOfItemsPerPage]);

  

  const toggleSwitch = (isEnabled) => {
    setIsEnabled(!isEnabled);
    if (isEnabled === false) {
      setFilters({
        fromDate: startOfMonth,
        toDate: endOfMonth,
        ID_Toanha: null,
        ID_Khuvuc: null,
        ID_Tang: null,
      });
    }
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const handlePresentModalPress2 = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const handlePresentModalClose = useCallback(() => {
    setOpacity(1);
    bottomSheetModalRef?.current?.close();
  });

  const handlePresentModalClose2 = useCallback(() => {
    setOpacity(1);
    bottomSheetModalRef2?.current?.close();
  });

  const decimalNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`;
    if (number === 0) return `0`;
    return number;
  };

  const handleModalShow = (active, op) => {
    setModalVisible(active);
    setOpacity(Number(op));
  };

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const _renderItem = ({ item, index }) => {
    const isExistIndex = newActionCheckList?.find(
      (existingItem) =>
        existingItem?.ID_Checklistchitiet === item?.ID_Checklistchitiet
    );

    return (
      <TouchableHighlight key={index} onPress={() => toggleTodo(item)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
        >
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {moment(item?.tb_checklistc?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={3}
            >
              {item?.ent_checklist?.Checklist}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.ent_hangmuc?.ent_khuvuc?.ent_toanha?.Toanha}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.ent_tang?.Tentang}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_checklist?.ent_hangmuc?.ent_khuvuc?.Tenkhuvuc}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {" "}
              {item?.tb_checklistc?.ent_khoicv?.KhoiCV}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.tb_checklistc?.ent_calv?.Tenca}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.tb_checklistc?.ent_giamsat?.Hoten}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Ketqua}
            </Text>
          </DataTable.Cell>

          {/* <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={5}
            >
              {item?.Ghichu}
            </Text>
          </DataTable.Cell> */}
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  return (
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
            <ScrollView
              style={{
                flex: 1,
                opacity: opacity,
              }}
            >
              <ScrollView>
                {/* Tra cứu  */}
                <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => handlePresentModalClose()}>
                    <View style={{ width: "100%" }}>
                  <Text allowFontScaling={false}  style={styles.danhmuc}>
                    Tra cứu
                  </Text>
                  <Text allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      color: "white",
                      fontWeight: "600",
                      paddingBottom: 20,
                    }}
                  >
                    Số lượng: {decimalNumber(data?.data?.length)}
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "left",
                        }}
                      >
                        <TouchableOpacity
                          onPress={handlePresentModalPress}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Image
                            source={require("../../../assets/icons/filter_icon.png")}
                            resizeMode="contain"
                            style={{ height: 24, width: 24 }}
                          />
                          <Text allowFontScaling={false}  style={styles.text}>
                            Lọc dữ liệu
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {data.data && data?.data?.length > 0 ? (
                        <>
                          <ScrollView
                            style={{ flex: 1, marginBottom: 20, marginTop: 20 }}
                          >
                            <DataTable
                              style={{
                                backgroundColor: "white",
                                borderRadius: 8,
                              }}
                            >
                              <ScrollView
                                horizontal
                                contentContainerStyle={{
                                  flexDirection: "column",
                                }}
                              >
                                <DataTable.Header
                                  style={{
                                    backgroundColor: "#eeeeee",
                                    borderTopRightRadius: 8,
                                    borderTopLeftRadius: 8,
                                  }}
                                >
                                  {headerList &&
                                    headerList.map((item, index) => {
                                      return (
                                        <DataTable.Title
                                          key={index}
                                          style={{
                                            width: item?.width,
                                            borderRightWidth:
                                              index === headerList.length - 1
                                                ? 0
                                                : 2,
                                            borderRightColor: "white",
                                            justifyContent: "center",
                                          }}
                                          numberOfLines={2}
                                        >
                                          <Text allowFontScaling={false}
                                            style={[
                                              styles.text,
                                              { color: "black" },
                                            ]}
                                          >
                                            {item?.til}
                                          </Text>
                                        </DataTable.Title>
                                      );
                                    })}
                                </DataTable.Header>

                                {data?.data && data?.data?.length > 0 && (
                                  <FlatList
                                    keyExtractor={(item, index) =>
                                      `${item?.ID_ChecklistC}_${index}`
                                    }
                                    scrollEnabled={true}
                                    data={data?.data}
                                    renderItem={_renderItem}
                                  />
                                )}
                                <DataTable.Pagination
                                  style={{ justifyContent: "flex-start" }}
                                  page={page}
                                  numberOfPages={Math.ceil(data?.totalPages)}
                                  onPageChange={(page) => {
                                    setPage(page);
                                    // fetchData()
                                  }}
                                  label={`Từ ${page + 1} đến ${
                                    data?.totalPages
                                  }`}
                                  showFastPaginationControls
                                  numberOfItemsPerPageList={
                                    numberOfItemsPerPageList
                                  }
                                  numberOfItemsPerPage={numberOfItemsPerPage}
                                  onItemsPerPageChange={onItemsPerPageChange}
                                  selectPageDropdownLabel={
                                    "Hàng trên mỗi trang"
                                  }
                                />
                              </ScrollView>
                            </DataTable>
                          </ScrollView>
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              marginBottom: 120,
                            }}
                          >
                            <Image
                              source={require("../../../assets/icons/delete_bg.png")}
                              resizeMode="contain"
                              style={{ height: 120, width: 120 }}
                            />
                            <Text allowFontScaling={false}
                              style={[styles.danhmuc, { paddingVertical: 10 }]}
                            >
                              Không có dữ liệu cần tìm
                            </Text>
                          </View>
                        </>
                      )}
                    </>
                  )}
                </View>

                {/* Thống kê  */}
                <DanhmucThongKe
                  handlePresentModalPress2={handlePresentModalPress2}
                />
              </ScrollView>
            </ScrollView>

            {/* Bottom sheet modal tra cuu  */}
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.contentContainer}>
                <ModalTracuu
                  handleChangeFilters={handleChangeFilters}
                  filters={filters}
                  toggleDatePicker={toggleDatePicker}
                  isDatePickerVisible={isDatePickerVisible}
                  ent_toanha={ent_toanha}
                  ent_tang={ent_tang}
                  ent_khuvuc={ent_khuvuc}
                  setIsEnabled={setIsEnabled}
                  toggleSwitch={toggleSwitch}
                  isEnabled={isEnabled}
                  dataKhuvuc={dataKhuvuc}
                  fetchData={fetchData}
                  handlePresentModalClose={handlePresentModalClose}
                />
              </BottomSheetScrollView>
            </BottomSheetModal>

            {/* Bottom sheet modal thong ke  */}
            <BottomSheetModal
              ref={bottomSheetModalRef2}
              index={0}
              snapPoints={snapPoints2}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={styles.contentContainer}>
                <ModalTracuu
                  handleChangeFilters={handleChangeFilters}
                  filters={filters}
                  toggleDatePicker={toggleDatePicker}
                  isDatePickerVisible={isDatePickerVisible}
                  ent_toanha={ent_toanha}
                  ent_tang={ent_tang}
                  ent_khuvuc={ent_khuvuc}
                  setIsEnabled={setIsEnabled}
                  toggleSwitch={toggleSwitch}
                  isEnabled={isEnabled}
                  dataKhuvuc={dataKhuvuc}
                  fetchData={fetchData}
                  handlePresentModalClose={handlePresentModalClose}
                />
              </BottomSheetScrollView>
            </BottomSheetModal>
            <View
              style={{
                width: 60,
                position: "absolute",
                right: 20,
                bottom: 50,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              {newActionCheckList?.length > 0 &&
                isShowChecklist &&
                (newActionCheckList[0]?.Anh !== null &&
                newActionCheckList[0]?.Anh !== "" ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleModalShow(true, 0.2)}
                  >
                    <Feather name="image" size={26} color="white" />
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleModalShow(true, 0.2)}
                    >
                      <Feather name="eye" size={26} color="white" />
                    </TouchableOpacity>
                  </>
                ))}

              {/* {userChecklist && userChecklist.Permission === 1 && (
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={fetchDataExcel}
                >
                  <Feather name="save" size={26} color="white" />
                </TouchableOpacity>
              )} */}
            </View>

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
                  <Text allowFontScaling={false}  style={styles.modalText}>
                    Thông tin Checklist
                  </Text>

                  <ScrollView>
                    {newActionCheckList[0]?.Anh !== null &&
                      newActionCheckList[0]?.Anh !== "" && (
                        <Image
                          style={{
                            width: SIZES.width * 0.8,
                            height: SIZES.height * 0.5,
                            objectFit:'cover',
                          }}
                          source={{
                            uri: `https://drive.google.com/thumbnail?id=${newActionCheckList[0]?.Anh}`,
                          }}
                        />
                      )}

                    <View
                      style={{
                        flexDirection: "column",
                        marginVertical: 15,
                        gap: 4,
                      }}
                    >
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Tầng:{" "}
                        {
                          newActionCheckList[0]?.ent_checklist?.ent_tang
                            ?.Tentang
                        }
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Khu vực:{" "}
                        {
                          newActionCheckList[0]?.ent_checklist?.ent_khuvuc
                            ?.Tenkhuvuc
                        }
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Tòa nhà:{" "}
                        {
                          newActionCheckList[0]?.ent_checklist?.ent_khuvuc
                            ?.ent_toanha?.Toanha
                        }
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Khối công việc:{" "}
                        {
                          newActionCheckList[0]?.tb_checklistc?.ent_khoicv
                            ?.KhoiCV
                        }
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Người checklist:{" "}
                        {
                          newActionCheckList[0]?.tb_checklistc?.ent_giamsat
                            ?.Hoten
                        }
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Ca làm việc:{" "}
                        {newActionCheckList[0]?.tb_checklistc?.ent_calv?.Tenca}{" "}
                        (
                        {
                          newActionCheckList[0]?.tb_checklistc?.ent_calv
                            ?.Giobatdau
                        }{" "}
                        -{" "}
                        {
                          newActionCheckList[0]?.tb_checklistc?.ent_calv
                            ?.Gioketthuc
                        }
                        )
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Kết quả: {newActionCheckList[0]?.Ketqua}
                      </Text>
                      <Text allowFontScaling={false}  style={styles.textModal}>
                        Ghi chú: {newActionCheckList[0]?.Ghichu}
                      </Text>
                    </View>
                  </ScrollView>
                </View>
                <TouchableOpacity
                  onPress={() => handleModalShow(false, 1)}
                  style={styles.buttonImage}
                >
                  <Text allowFontScaling={false}  style={styles.textImage}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </ImageBackground>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DanhmucTracuu;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
  textModal: { fontSize: 15, color: "black", fontWeight: "600" },
  button: {
    backgroundColor: COLORS.color_bg,
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    flexDirection: "row",
    backgroundColor: COLORS.bg_button,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  textImage: {
    padding: 12,
    color: "white",
    fontWeight: "700",
    fontSize: 16,
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
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // height: SIZES.height * 0.7,
    width: SIZES.width * 0.85,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 10,
  },
});
