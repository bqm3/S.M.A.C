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
  TouchableWithoutFeedback
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
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";
import ButtonChecklist from "../../components/Button/ButtonCheckList";
import { COLORS, SIZES } from "../../constants/theme";
import { ent_calv_get, ent_giamsat_get } from "../../redux/actions/entActions";
import { tb_checklistc_get } from "../../redux/actions/tbActions";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import moment from "moment";
import ModalChecklistC from "../../components/Modal/ModalChecklistC";
import ModalChecklistCImage from "../../components/Modal/ModalChecklistCImage";
// import mime from "mime";

const numberOfItemsPerPageList = [20, 30, 50];

const headerList = [
  {
    til: "Ngày",
    width: 120,
  },

  {
    til: "Tên ca",
    width: 150,
  },
  {
    til: "Số lượng",
    width: 100,
  },

  {
    til: "Nhân viên",
    width: 150,
  },
  {
    til: "Giờ bắt đầu - Giờ kết thúc",
    width: 150,
  },

  {
    til: "Tình trạng",
    width: 150,
  },
  {
    til: "Ghi chú",
    width: 200,
  },
];

const DanhmucThongKe = ({ handlePresentModalPress2 }) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const { ent_giamsat, ent_calv } = useSelector((state) => state.entReducer);
  const { tb_checklistc } = useSelector((state) => state.tbReducer);
  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const date = new Date();
  const dateDay = moment(date).format("YYYY-MM-DD");
  const dateHour = moment(date).format("LTS");

  const [data, setData] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalRef2 = useRef(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const snapPoints2 = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);

  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [dataInput, setDataInput] = useState({
    dateDay: dateDay,
    dateHour: dateHour,
    Calv: null,
    ID_Giamsat: null,
    ID_Duan: userChecklist?.ID_Duan,
  });

  const [dataImages, setDataImages] = useState({
    Giochupanh1: null,
    Anh1: null,
    Giochupanh2: null,
    Anh2: null,
    Giochupanh3: null,
    Anh3: null,
    Giochupanh4: null,
    Anh4: null,
  });

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeImages = (key, value) => {
    setDataImages((data) => ({
      ...data,
      [key]: value,
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); //

  useEffect(() => {
    setData(tb_checklistc?.data);
  }, [tb_checklistc]);

  const init_ca = async () => {
    await dispath(ent_calv_get());
  };

  const int_giamsat = async () => {
    await dispath(ent_giamsat_get());
  };

  const int_checklistc = async () => {
    await dispath(
      tb_checklistc_get({ page: page, limit: numberOfItemsPerPage })
    );
  };

  useEffect(() => {
    int_checklistc();
  }, [numberOfItemsPerPage, page]);

  useEffect(() => {
    init_ca();
    int_giamsat();
    int_checklistc();
  }, []);

  const toggleTodo = async (item) => {
    // setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) => existingItem.ID_ChecklistC === item.ID_ChecklistC
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList([item]);
    }
  };

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const _renderItem = ({ item, index }) => {
    const isExistIndex = newActionCheckList?.find(
      (existingItem) => existingItem?.ID_ChecklistC === item?.ID_ChecklistC
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
              style={{ color: isExistIndex ? "white" : "black", fontSize: 15 }}
              numberOfLines={2}
            >
              {moment(item?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <View
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 16,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              numberOfLines={4}
            >
              <Text allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 16,
                  fontWeight: "700",
                }}
                numberOfLines={2}
              >
                {item?.ent_khoicv?.KhoiCV}
              </Text>
              <Text allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {item?.ent_calv?.Tenca}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black", fontSize: 15 }}
              numberOfLines={2}
            >
              {item?.TongC}/{item?.Tong}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black", fontSize: 15 }}
              numberOfLines={2}
            >
              {item?.ent_giamsat?.Hoten}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <View
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: 15,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              numberOfLines={4}
            >
              <Text allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {item?.Giobd}
              </Text>
              <Text allowFontScaling={false}>-</Text>
              <Text allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: 15,
                }}
                numberOfLines={2}
              >
                {item?.Giokt}
              </Text>
            </View>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black", fontSize: 15 }}
              numberOfLines={2}
            >
              {" "}
              {item?.Tinhtrang === 1 ? "Xong" : ""}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black", fontSize: 15 }}
              numberOfLines={3}
            >
              {item?.Ghichu}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  const decimalNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`;
    if (number === 0) return `0`;
    return number;
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          opacity: opacity,
        }}
      >
        <View style={styles.container}>
          <Text allowFontScaling={false}  style={styles.danhmuc}>
            Thống kê
          </Text>
          <Text allowFontScaling={false}
            style={{
              fontSize: 18,
              color: "white",
              fontWeight: "600",
              paddingBottom: 20,
            }}
          >
            Số lượng: {decimalNumber(data?.length)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "left",
            }}
          >
            <TouchableOpacity
              onPress={handlePresentModalPress2}
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
              <></>
            </TouchableOpacity>
          </View>
          {isLoading ? (
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
              {data && data?.length > 0 ? (
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
                                    index === headerList.length - 1 ? 0 : 2,
                                  borderRightColor: "white",
                                  justifyContent: "center",
                                }}
                                numberOfLines={2}
                              >
                                <Text allowFontScaling={false} style={[styles.text, { color: "black" }]}>
                                  {item?.til}
                                </Text>
                              </DataTable.Title>
                            );
                          })}
                      </DataTable.Header>

                      {data && data?.length > 0 && (
                        <FlatList
                          keyExtractor={(item, index) =>
                            `${item?.ID_ChecklistC}_${index}`
                          }
                          scrollEnabled={true}
                          data={data}
                          renderItem={_renderItem}
                        />
                      )}
                      <DataTable.Pagination
                        style={{ justifyContent: "flex-start" }}
                        page={page}
                        numberOfPages={Math.ceil(tb_checklistc?.totalPages)}
                        onPageChange={(page) => {
                          setPage(page);
                        }}
                        label={`Từ ${page + 1} đến ${
                          tb_checklistc?.totalPages
                        }`}
                        showFastPaginationControls
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={numberOfItemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        selectPageDropdownLabel={"Hàng trên mỗi trang"}
                      />
                    </ScrollView>
                  </DataTable>
                </ScrollView>
              ) : (
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
                  <Text allowFontScaling={false} style={[styles.danhmuc, { paddingVertical: 10 }]}>
                    Bạn chưa thêm dữ liệu nào
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
  },
  text: { fontSize: 15, color: "white", fontWeight: "600" },
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
    width: 65,
    height: 65,
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
});

export default DanhmucThongKe;
