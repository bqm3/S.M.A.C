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
  TouchableWithoutFeedback,
  TouchableNativeFeedback
} from "react-native";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
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
import {
  ent_calv_get,
  ent_giamsat_get,
  ent_hangmuc_get,
  ent_khuvuc_get,
} from "../../redux/actions/entActions";
import { tb_checklistc_get } from "../../redux/actions/tbActions";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import moment from "moment";
import ModalChecklistC from "../../components/Modal/ModalChecklistC";
import ModalChecklistCImage from "../../components/Modal/ModalChecklistCImage";
import DataContext from "../../context/DataContext";
import adjust from "../../constants/adjust";
import { useFocusEffect } from "@react-navigation/native";
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

const ThucHienChecklist = ({ navigation }) => {
  const ref = useRef(null);
  const dispath = useDispatch();
  const { ent_giamsat, ent_calv, ent_hangmuc } = useSelector(
    (state) => state.entReducer
  );
  const { tb_checklistc } = useSelector((state) => state.tbReducer);
  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);
  const { setDataHangmuc, stepKhuvuc } = useContext(DataContext);

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
    ID_Duan: userChecklist.ID_Duan,
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
    const interval = setInterval(() => {
      setDataInput((prevData) => ({
        ...prevData,
        dateHour: moment().format("LTS"),
      }));
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);


  useEffect(() => {
    setData(tb_checklistc?.data);
  }, [tb_checklistc]);

  const int_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const int_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  useEffect(() => {
    int_khuvuc();
    int_hangmuc();
  }, []);

  useEffect(() => {
    if (ent_hangmuc) {
      const hangmucIds = ent_hangmuc.map((item) => item.ID_Hangmuc);
      setDataHangmuc(hangmucIds);
    }
  }, [ent_hangmuc]);

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
  }, [numberOfItemsPerPage, page, stepKhuvuc]);

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen is focused
      int_checklistc();
    }, [])
  );

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

  const handlePushDataImagesSave = async (id) => {
    try {
      setLoadingSubmit(true);
      let formData = new FormData();

      // Iterate over the keys of dataImages object
      if (dataImages.Anh1) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh1?.uri
              : dataImages?.Anh1?.uri.replace("file://", ""),
          name:
            dataImages?.Anh1?.fileName ||
            Math.floor(Math.random() * Math.floor(99999999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh1`, file?.name);
        formData.append("Giochupanh1", dateHour);
      }
      if (dataImages.Anh2) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh2?.uri
              : dataImages?.Anh2?.uri.replace("file://", ""),
          name:
            dataImages?.Anh2?.fileName ||
            Math.floor(Math.random() * Math.floor(99999999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh2`, file?.name);
        formData.append("Giochupanh2", dateHour);
      }
      if (dataImages.Anh3) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh3?.uri
              : dataImages?.Anh3?.uri.replace("file://", ""),
          name:
            dataImages?.Anh3?.fileName ||
            Math.floor(Math.random() * Math.floor(99999999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh3`, file?.name);
        formData.append("Giochupanh3", dateHour);
      }
      if (dataImages.Anh4) {
        const file = {
          uri:
            Platform.OS === "android"
              ? dataImages?.Anh4?.uri
              : dataImages?.Anh4?.uri.replace("file://", ""),
          name:
            dataImages?.Anh4?.fileName ||
            Math.floor(Math.random() * Math.floor(999999999)) + ".jpeg",
          type: "image/jpeg",
        };

        // Append image file to formData
        formData.append(`Images`, file);
        formData.append(`Anh4`, file?.name);
        formData.append("Giochupanh4", dateHour);
      }

      await axios
        .post(
          BASE_URL_CHECKLIST +
            `/tb_checklistc/update_images/${newActionCheckList[0].ID_ChecklistC}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authTokenChecklist,
            },
          }
        )
        .then((res) => {
          setLoadingSubmit(false);
          int_checklistc();
          // handleCloseSheetImage();
          // bottomSheetModalRef2?.current?.close();
          Alert.alert("PMC Thông báo", "Checklist thành công", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        })
        .catch((error) => {
          console.log("error", error.response);
          setLoadingSubmit(false);
          // Handle the error appropriately, e.g., displaying an error message
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
            Alert.alert(
              "PMC Thông báo",
              "Không nhận được phản hồi từ máy chủ",
              [
                {
                  text: "Hủy",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
              ]
            );
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
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePushDataSave = async () => {
    if (dataInput.ID_Calv === null || dataInput.ID_Giamsat === null) {
      Alert.alert("PMC Thông báo", "Chưa chọn ca làm việc hoặc người giám sát", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      let data = {
        ID_Calv: dataInput.Calv.ID_Calv,
        ID_User: userChecklist.ID_User,
        ID_Giamsat: dataInput.ID_Giamsat,
        ID_Duan: userChecklist.ID_Duan,
        ID_KhoiCV: userChecklist.ID_KhoiCV,
        Ngay: dataInput.dateDay,
        Giobd: dataInput.dateHour,
      };
      setLoadingSubmit(true);
      try {
        await axios
          .post(BASE_URL_CHECKLIST + "/tb_checklistc/create", data, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenChecklist,
            },
          })
          .then((response) => {
            handleAdd();
            int_checklistc();
            handleCloseSheetImage();
            setLoadingSubmit(false);
            handleChecklistDetail(
              response.data.data.ID_ChecklistC,
              response.data.data.ID_KhoiCV,
              response.data.data.ID_Calv,
              response.data.data.ID_Toanha,
              response.data.data.ID_Khuvucs,
              null
            );
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
          console.log(error.request);
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
          console.log("Error", error.message);
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

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      // bottomSheetModalRef?.current?.close();
      setOpacity(1);
      handleAdd();
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleSheetChanges2 = useCallback((index) => {
    if (index === -1) {
      setOpacity(1);
      handleAdd();
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleCloseSheetImage = useCallback(() => {
    bottomSheetModalRef?.current?.close();
    bottomSheetModalRef2?.current?.close();
    setOpacity(1);
  }, []);

  const handleToggleModal = () => {
    bottomSheetModalRef2?.current?.present();
    setOpacity(0.2);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
    setOpacity(0.2);
  }, []);

  const handleAdd = () => {
    setDataInput({
      dateDay: dateDay,
      dateHour: dateHour,
      Calv: null,
      ID_Giamsat: null,
      ID_Duan: userChecklist.ID_Duan,
    });
    setDataImages({
      Giochupanh1: null,
      Anh1: null,
      Giochupanh2: null,
      Anh2: null,
      Giochupanh3: null,
      Anh3: null,
      Giochupanh4: null,
      Anh4: null,
    });
  };

  const handleChecklistDetail = (id1, id2, id3, id4, id5) => {
    navigation.navigate("Thực hiện khu vực", {
      ID_ChecklistC: id1,
      ID_KhoiCV: id2,
      ID_Calv: id3,
      ID_Toanha: id4,
      ID_Khuvucs: id5
    });

    setNewActionCheckList([]);
  };

  const handleCloseChecklist = async (ID_ChecklistC) => {
    await axios
      .put(
        BASE_URL_CHECKLIST + `/tb_checklistc/close/${ID_ChecklistC}`,
        {
          Giokt: dateHour,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authTokenChecklist,
          },
        }
      )
      .then(() => {
        int_checklistc();
        setNewActionCheckList([]);
        Alert.alert("PMC Thông báo", "Khóa ca thành công", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => {} },
        ]);
      })
      .catch((err) => {
        Alert.alert("PMC Thông báo", "Khóa ca thất bại. Vui lòng thử lại!!", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => {} },
        ]);
      });
  };

  const handleChecklistClose = (item) => {
    Alert.alert("PMC Thông báo", "Bạn muốn khóa ca checklist ?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: () => handleCloseChecklist(item?.ID_ChecklistC),
      },
    ]);
  };

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
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(15),
              }}
              numberOfLines={2}
            >
              {moment(item?.Ngay).format("DD-MM-YYYY")}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <View
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(16),
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              numberOfLines={4}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: adjust(16),
                  fontWeight: "700",
                }}
                numberOfLines={2}
              >
                {item?.ent_khoicv?.KhoiCV}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: adjust(15),
                }}
                numberOfLines={2}
              >
                {item?.ent_calv?.Tenca}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(15),
              }}
              numberOfLines={2}
            >
              {item?.TongC}/{item?.Tong}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(15),
              }}
              numberOfLines={2}
            >
              {item?.ent_giamsat?.Hoten}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <View
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(15),
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              numberOfLines={4}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: adjust(15),
                }}
                numberOfLines={2}
              >
                {item?.Giobd}
              </Text>
              <Text allowFontScaling={false}>-</Text>
              <Text
                allowFontScaling={false}
                style={{
                  color: isExistIndex ? "white" : "black",
                  fontSize: adjust(15),
                }}
                numberOfLines={2}
              >
                {item?.Giokt}
              </Text>
            </View>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 150, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(15),
              }}
              numberOfLines={2}
            >
              {" "}
              {item?.Tinhtrang === 1 ? "Xong" : ""}
            </Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 200, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{
                color: isExistIndex ? "white" : "black",
                fontSize: adjust(15),
              }}
              numberOfLines={3}
            >
              {item?.Ghichu}
            </Text>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableHighlight>
    );
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
              <ScrollView
                style={{
                  flex: 1,
                  opacity: opacity,
                }}
              >
                <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => handleCloseSheetImage()}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                   
                      {userChecklist.Permission !== 1 && (
                        <ButtonChecklist
                          text={"Thêm mới"}
                          width={"auto"}
                          color={COLORS.bg_button}
                          // icon={<Ionicons name="add" size={20} color="white" />}
                          onPress={handlePresentModalPress}
                        />
                      )}
                   
                  </View>
                  </TouchableWithoutFeedback>
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
                                            index === headerList.length - 1
                                              ? 0
                                              : 2,
                                          borderRightColor: "white",
                                          justifyContent: "center",
                                        }}
                                        numberOfLines={2}
                                      >
                                        <Text
                                          allowFontScaling={false}
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
                                numberOfPages={Math.ceil(
                                  tb_checklistc?.totalPages
                                )}
                                onPageChange={(page) => {
                                  setPage(page);
                                }}
                                label={`Từ ${page + 1} đến ${
                                  tb_checklistc?.totalPages
                                }`}
                                showFastPaginationControls
                                numberOfItemsPerPageList={
                                  numberOfItemsPerPageList
                                }
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
                          <Text
                            allowFontScaling={false}
                            style={[styles.danhmuc, { paddingVertical: 10 }]}
                          >
                            Bạn chưa có dữ liệu nào
                          </Text>
                          
                        </View>
                      )}
                    </>
                  )}
                </View>
              </ScrollView>

              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
              >
                <View style={styles.contentContainer}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: "black",
                      fontWeight: "600",
                      fontSize: 20,
                      textAlign: "center",
                      paddingTop: 10,
                    }}
                  >
                    {userChecklist.ent_khoicv?.KhoiCV}
                  </Text>
                  <ModalChecklistC
                    ent_giamsat={ent_giamsat}
                    ent_calv={ent_calv}
                    dataInput={dataInput}
                    handleChangeText={handleChangeText}
                    handlePushDataSave={handlePushDataSave}
                    isLoading={loadingSubmit}
                  />
                </View>
              </BottomSheetModal>

              <BottomSheetModal
                ref={bottomSheetModalRef2}
                index={0}
                snapPoints={snapPoints2}
                onChange={handleSheetChanges2}
              >
                <View style={styles.contentContainer}>
                  <ModalChecklistCImage
                    dataImages={dataImages}
                    handleChangeImages={handleChangeImages}
                    ent_giamsat={ent_giamsat}
                    ent_calv={ent_calv}
                    dataInput={dataInput}
                    handleChangeText={handleChangeText}
                    handlePushDataSave={handlePushDataSave}
                    isLoading={loadingSubmit}
                    handlePushDataImagesSave={handlePushDataImagesSave}
                    newActionCheckList={newActionCheckList}
                  />
                </View>
              </BottomSheetModal>

              {newActionCheckList?.length > 0 && userChecklist.Permission !== 1 && (
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
                  {newActionCheckList[0]?.Tinhtrang === 0 && (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          { backgroundColor: COLORS.bg_red },
                        ]}
                        onPress={() =>
                          handleChecklistClose(newActionCheckList[0])
                        }
                      >
                        <Feather name="lock" size={26} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() =>
                          handleChecklistDetail(
                            newActionCheckList[0]?.ID_ChecklistC,
                            newActionCheckList[0]?.ID_KhoiCV,
                            newActionCheckList[0]?.ID_Calv,
                            newActionCheckList[0]?.ID_Toanha,
                            newActionCheckList[0]?.ID_Khuvucs
                          )
                        }
                      >
                        <Feather name="unlock" size={26} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleToggleModal()}
                      >
                        <Feather name="camera" size={26} color="white" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </ImageBackground>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
    // paddingVertical: 40,
  },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
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
    fontSize: adjust(20),
    fontWeight: "600",
    paddingVertical: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default ThucHienChecklist;
