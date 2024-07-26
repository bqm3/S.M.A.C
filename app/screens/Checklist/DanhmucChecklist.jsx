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
import {
  ent_checklist_get,
  ent_tang_get,
  ent_khuvuc_get,
  ent_toanha_get,
  ent_khoicv_get,
  ent_calv_filter,
  ent_hangmuc_get,
} from "../../redux/actions/entActions";
import ModalChecklist from "../../components/Modal/ModalChecklist";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import ActionCheckbox from "../../components/Active/ActiveCheckbox";
import ActionCheckboxAll from "../../components/Active/ActiveCheckboxAll";
import ModalChecklistInfo from "../../components/Modal/ModalChecklistInfo";
import ModalChecklistFilter from "../../components/Modal/ModalChecklistFilter";

const numberOfItemsPerPageList = [50, 100, 150];

const headerList = [
  {
    til: "Tên checklist",
    width: 150,
  },
  {
    til: "Khu vực",
    width: 120,
  },
  {
    til: "Bộ phận",
    width: 120,
  },
];

const DanhmucChecklist = ({ navigation }) => {
  const dispath = useDispatch();
  const {
    ent_tang,
    ent_khuvuc,
    ent_checklist,
    ent_khoicv,
    ent_toanha,
    ent_calv,
    ent_hangmuc,
  } = useSelector((state) => state.entReducer);
  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const [listChecklist, setListChecklist] = useState([]);
  const [newActionCheckList, setNewActionCheckList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleFilter, setModalVisibleFilter] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [isCheckUpdate, setIsCheckUpdate] = useState({
    check: false,
    id_checklist: null,
  });

  const [isFilterData, setIsFilterData] = useState({
    ID_Khuvuc: null,
    ID_Hangmuc: null,
    ID_Calamvic: null,
    ID_Tang: null,
  });

  const [dataCheckKhuvuc, setDataCheckKhuvuc] = useState({
    ID_KhoiCV: null,
    ID_Toanha: null,
  });

  const [filters, setFilters] = useState({
    ID_Tang: false,
    ID_Hangmuc: false,
    ID_Calamvic: false,
    ID_Khuvuc: false,
  });

  const [calvFilter, setCalvFilter] = useState([]);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [opacity, setOpacity] = useState(1);
  const [page, setPage] = React.useState(0);

  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [dataInput, setDataInput] = useState({
    ID_Khuvuc: null,
    ID_Tang: null,
    ID_Hangmuc: null,
    Sothutu: "",
    Maso: "",
    MaQrCode: "",
    Checklist: "",
    Ghichu: "",
    Tieuchuan: "",
    Giatridinhdanh: "",
    Giatrinhan: "",
    Sothutu: "",
  });
  const [hangMuc, setHangMuc] = useState(ent_hangmuc);

  const [isEnabled, setIsEnabled] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [status, setStatus] = useState(false);

  const init_checklist = async () => {
    await dispath(
      ent_checklist_get({ page: page, limit: numberOfItemsPerPage })
    );
  };

  const init_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };
  useEffect(() => {
    init_checklist();
  }, [numberOfItemsPerPage, page]);

  useEffect(() => {
    setListChecklist(ent_checklist);
  }, [ent_checklist]);

  const init_tang = async () => {
    await dispath(ent_tang_get());
  };

  const init_khoicv = async () => {
    await dispath(ent_khoicv_get());
  };

  const init_toanha = async () => {
    await dispath(ent_toanha_get());
  };

  const init_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  const init_calv = async (id) => {
    await dispath(ent_calv_filter(id));
  };

  useEffect(() => {
    init_checklist();
    init_khuvuc();
    init_tang();
    init_khoicv();
    init_toanha();
    init_hangmuc();
    init_calv(null);
  }, []);

  const asyncHangMuc = async () => {
    await axios
      .get(
        BASE_URL_CHECKLIST +
          `/ent_hangmuc/filter/${
            dataInput?.ID_Khuvuc || isFilterData.ID_Khuvuc
          }`,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authTokenChecklist,
          },
        }
      )
      .then((res) => {
        setHangMuc(res.data.data);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    asyncHangMuc();
  }, [dataInput.ID_Khuvuc, isFilterData.ID_Khuvuc]);

  useEffect(() => {
    init_calv(dataCheckKhuvuc.ID_KhoiCV);
  }, [dataCheckKhuvuc.ID_KhoiCV]);

  useEffect(() => {
    const calvIds = ent_calv.map((item) => item.ID_Calv);

    // Update the state with the extracted ID_Calv values
    setCalvFilter(calvIds);
  }, [ent_calv]);

  const toggleSwitch = (isEnabled) => {
    setIsEnabled(!isEnabled);
    if (isEnabled === false) {
      setIsFilterData({
        ID_Tang: null,
        ID_Khuvuc: null,
        ID_Hangmuc: null,
      });
      setFilters({
        ID_Tang: false,
        ID_Hangmuc: false,
        ID_Khuvuc: false,
      });
    }
  };

  const handleCheckbox = (key, value) => {
    setFilters((data) => ({
      ...data,
      [key]: value,
    }));
    setIsEnabled(false);
  };

  useEffect(() => {
    setIsLoading(true);
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); //

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const toggleTodo = async () => {
    // Calculate the lengths of newActionCheckList and listChecklist.data
    const newActionLength = newActionCheckList?.length ?? 0;
    const listChecklistLength = listChecklist?.data?.length ?? 0;

    // Determine the new action checklist data and status
    let newActionCheckListData;
    let newStatus;

    if (newActionLength === 0) {
      // If newActionCheckList is empty, fill it with listChecklist.data
      newActionCheckListData = listChecklist.data;
      newStatus = true;
    } else if (newActionLength > 0 && newActionLength < listChecklistLength) {
      // If newActionCheckList is partially filled
      newActionCheckListData = status ? [] : listChecklist.data;
      newStatus = !status;
    } else if (newActionLength === listChecklistLength && status) {
      // If newActionCheckList is fully filled and status is true
      newActionCheckListData = [];
      newStatus = false;
    } else {
      // Default case: clear newActionCheckList and set status to false
      newActionCheckListData = [];
      newStatus = false;
    }

    // Update state based on the calculated newStatus and newActionCheckListData
    setNewActionCheckList(newActionCheckListData);
    setStatus(newStatus);
    setIsCheckbox(newStatus);
  };

  const handleToggle = async (data) => {
    setIsCheckbox(true);
    const isExistIndex = newActionCheckList.findIndex(
      (existingItem) => existingItem.ID_Checklist === data.ID_Checklist
    );

    // Nếu item đã tồn tại, xóa item đó đi
    if (isExistIndex !== -1) {
      setNewActionCheckList((prevArray) =>
        prevArray.filter((_, index) => index !== isExistIndex)
      );
    } else {
      // Nếu item chưa tồn tại, thêm vào mảng mới
      setNewActionCheckList((prevArray) => [...prevArray, data]);
    }
  };

  const handleToggleModal = (isCheck, data, opacity) => {
    setOpacity(Number(opacity));
    setDataModal(data);
    setModalVisible(isCheck);

    bottomSheetModalRef?.current?.close();
  };

  const [dataKhuVuc, setDataKhuVuc] = useState({});

  const [activeKhuVuc, setActiveKhuvuc] = useState(false);

  const handleChangeTextKhuVuc = (key, value) => {
    setDataCheckKhuvuc((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleDataKhuvuc = async (data) => {
    if (data.ID_KhoiCV && data.ID_Toanha) {
      const dataSet = ent_khuvuc.filter(
        (item) =>
          `${item.ID_KhoiCV}_${item.ID_Toanha}` ===
          `${data.ID_KhoiCV}_${data.ID_Toanha}`
      );
      setDataKhuVuc(dataSet);
      setActiveKhuvuc(true);
    } else if (data.ID_KhoiCV) {
      const dataSet = ent_khuvuc.filter(
        (item) => `${item.ID_KhoiCV}` === `${data.ID_KhoiCV}`
      );
      setDataKhuVuc(dataSet);
      setActiveKhuvuc(true);
    } else if (data.ID_Toanha) {
      const dataSet = ent_khuvuc.filter(
        (item) => `${item.ID_Toanha}` === `${data.ID_Toanha}`
      );
      setDataKhuVuc(dataSet);
      setActiveKhuvuc(true);
    }
  };

  const handleChangeText = (key, value) => {
    setDataInput((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handleChangeFilter = (key, value) => {
    setIsFilterData((data) => ({
      ...data,
      [key]: value,
    }));
  };

  const handlePushDataSave = async () => {
    if (dataInput.Checklist === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin Checklist", [
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
        ID_Hangmuc: dataInput.ID_Hangmuc,
        ID_Tang: dataInput.ID_Tang,
        Sothutu: dataInput.Sothutu,
        Maso: dataInput.Maso,
        MaQrCode: dataInput.MaQrCode,
        Ghichu: dataInput.Ghichu,
        Tieuchuan: dataInput.Tieuchuan,
        Checklist: dataInput.Checklist,
        Giatridinhdanh: dataInput.Giatridinhdanh,
        Giatrinhan: dataInput.Giatrinhan,
        sCalv: calvFilter,
      };
      setLoadingSubmit(true);
      try {
        const response = await axios.post(
          BASE_URL_CHECKLIST + "/ent_checklist/create",
          data,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenChecklist,
            },
          }
        );
        setPage(0);
        init_checklist(0, numberOfItemsPerPage);
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

  const handleEditEnt = async (data) => {
    handlePresentModalPress();
    setDataInput({
      ID_Khuvuc: data.ID_Khuvuc,
      ID_Tang: data.ID_Tang,
      ID_Hangmuc: data.ID_Hangmuc,
      Sothutu: data.Sothutu,
      Maso: data.Maso,
      MaQrCode: data.MaQrCode,
      Checklist: data.Checklist,
      Giatridinhdanh: data.Giatridinhdanh,
      Giatrinhan: data.Giatrinhan,
      Sothutu: data.Sothutu,
    });

    setDataCheckKhuvuc({
      ID_KhoiCV: data.ent_hangmuc?.ent_khuvuc?.ID_KhoiCV,
      ID_Toanha: data.ent_hangmuc?.ent_khuvuc?.ID_Toanha,
    });

    handleDataKhuvuc({
      ID_KhoiCV: data.ent_hangmuc?.ent_khuvuc?.ID_KhoiCV,
      ID_Toanha: data.ent_hangmuc?.ent_khuvuc?.ID_Toanha,
    });

    setIsCheckUpdate({
      check: true,
      ID_CheckList: data.ID_Checklist,
    });
  };

  const handlePushDataEdit = async (id) => {
    if (dataInput.Checklist === "" || dataInput.Giatrinhan === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin checklist", [
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
        ID_Tang: dataInput.ID_Tang,
        ID_Hangmuc: dataInput.ID_Hangmuc,
        Sothutu: dataInput.Sothutu,
        Maso: dataInput.Maso,
        MaQrCode: dataInput.MaQrCode,
        Ghichu: dataInput.Ghichu,
        Tieuchuan: dataInput.Tieuchuan,
        Checklist: dataInput.Checklist,
        Giatridinhdanh: dataInput.Giatridinhdanh,
        Giatrinhan: dataInput.Giatrinhan,
        sCalv: calvFilter,
      };
      try {
        setLoadingSubmit(true);
        await axios
          .put(BASE_URL_CHECKLIST + `/ent_checklist/update/${id}`, data, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + authTokenChecklist,
            },
          })
          .then((response) => {
            setPage(0);
            init_checklist(0, numberOfItemsPerPage);
            handleAdd();
            handleCloseModal();
            setNewActionCheckList([]);
            setStatus(false);
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

  const handleAlertDelete = async (data) => {
    Alert.alert("PMC Thông báo", "Bạn có muốn xóa danh mục checklist", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Xác nhận", onPress: () => handlePushDataDelete(data) },
    ]);
  };

  const handlePushDataDelete = async (data) => {
    await axios
      .put(BASE_URL_CHECKLIST + `/ent_checklist/delete-all/${data}`, [], {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      })
      .then((response) => {
        handleAdd();
        setPage(0);
        init_checklist(0, numberOfItemsPerPage);
        setNewActionCheckList([]);
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

  const handleFilterData = async (isModal, opacity) => {
    setModalVisibleFilter(isModal);
    setOpacity(opacity);
    setIsCheckbox(false);
  };

  const handlePushDataCheck = async (isCheck) => {
    if (isCheck === true) {
      setListChecklist(ent_checklist);
      handleFilterData(false, 1);
    } else {
      await axios
        .post(BASE_URL_CHECKLIST + "/ent_checklist/filter", isFilterData, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authTokenChecklist,
          },
        })
        .then((res) => {
          setListChecklist(res.data);
          handleFilterData(false, 1);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const handleAdd = () => {
    setDataInput({
      ID_Khuvuc: null,
      ID_Tang: null,
      ID_Hangmuc: null,
      Sothutu: "",
      Maso: "",
      MaQrCode: "",
      Checklist: "",
      Ghichu: "",
      Tieuchuan: "",
      Giatridinhdanh: "",
      Giatrinhan: "",
    });
    setIsFilterData({
      ID_Tang: null,
      ID_Khuvuc: null,
      ID_Hangmuc: null,
    });
    setFilters({
      ID_Tang: false,
      ID_Khuvuc: false,
      ID_Hangmuc: false,
    });
    setIsCheckUpdate({
      check: false,
      id_checklist: null,
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef?.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      handleAdd();
      handleCloseModal();
    } else {
      setOpacity(0.2);
    }
  }, []);

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  const decimalNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`;
    return number;
  };

  const _renderItem = ({ item, index }) => {
    const isExistIndex = newActionCheckList?.find(
      (existingItem) => existingItem?.ID_Checklist === item?.ID_Checklist
    );
    return (
      <TouchableHighlight onPress={() => handleToggle(item)}>
        <DataTable.Row
          style={{
            gap: 20,
            paddingVertical: 10,
            backgroundColor: isExistIndex ? COLORS.bg_button : "white",
          }}
          key={index}
        >
          <DataTable.Cell style={{ width: 50 }}>
            <ActionCheckbox
              item={item}
              index={index}
              size={20}
              handleToggle={handleToggle}
              newActionCheckList={newActionCheckList}
              // active={}
            />
          </DataTable.Cell>

          <DataTable.Cell style={{ width: 150 }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={3}
            >
              {item?.Checklist}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120, justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {" "}
              {item?.ent_hangmuc?.ent_khuvuc?.Tenkhuvuc}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 120 }}>
            <Text
              allowFontScaling={false}
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.ent_hangmuc?.ent_khuvuc?.ent_khoicv?.KhoiCV}
            </Text>
          </DataTable.Cell>
          {/* <DataTable.Cell style={{ width: 150 }}>
            <Text allowFontScaling={false} 
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Giatridinhdanh}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text allowFontScaling={false} 
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Maso}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>
            <Text allowFontScaling={false} 
              style={{ color: isExistIndex ? "white" : "black" }}
              numberOfLines={2}
            >
              {item?.Sothutu}
            </Text>
          </DataTable.Cell> */}
        </DataTable.Row>
      </TouchableHighlight>
    );
  };

  let arrayId;
  if (Array.isArray(newActionCheckList)) {
    arrayId = newActionCheckList.map((item) => item?.ID_Checklist);
  } else {
    arrayId = [];
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <TouchableWithoutFeedback onPress={() => handleCloseModal()}> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                <TouchableWithoutFeedback onPress={() => handleCloseModal()}>
                  <View style={{ width: "100%" }}>
                    <Text allowFontScaling={false} style={styles.danhmuc}>
                      Danh mục Checklist
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 18,
                        color: "white",
                        fontWeight: "600",
                        paddingBottom: 20,
                      }}
                    >
                      Số lượng: {decimalNumber(listChecklist?.data?.length)}
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
                        alignItems: "center",
                        justifyContent: "space-between",
                        // flex: 1, backgroundColor: 'red'
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleFilterData(true, 0.5)}
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
                        <Text allowFontScaling={false} style={styles.text}>
                          Lọc dữ liệu
                        </Text>
                      </TouchableOpacity>
                      <ButtonChecklist
                        text={"Thêm mới"}
                        width={"auto"}
                        color={COLORS.bg_button}
                        // icon={<Ionicons name="add" size={20} color="white" />}
                        onPress={handlePresentModalPress}
                      />
                    </View>

                    {listChecklist?.data && listChecklist?.data?.length > 0 ? (
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
                              <DataTable.Title
                                key={-1}
                                style={{
                                  alignItems: "center",
                                  width: 50,
                                }}
                              >
                                <ActionCheckboxAll
                                  toggleTodo={toggleTodo}
                                  status={status}
                                />
                              </DataTable.Title>
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
                                        paddingLeft: 4,
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

                            {listChecklist?.data &&
                              listChecklist?.data?.length > 0 && (
                                <FlatList
                                  keyExtractor={(item, index) =>
                                    `${item?.ID_Khuvuc}_${index}`
                                  }
                                  scrollEnabled={true}
                                  data={listChecklist?.data}
                                  renderItem={_renderItem}
                                />
                              )}
                            <DataTable.Pagination
                              style={{ justifyContent: "flex-start" }}
                              page={page}
                              numberOfPages={Math.ceil(
                                ent_checklist?.totalPages
                              )}
                              onPageChange={(page) => {
                                setPage(page);
                                init_checklist(page, numberOfItemsPerPage);
                              }}
                              label={`Từ ${page + 1} đến ${
                                ent_checklist?.totalPages
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
                          <Text
                            allowFontScaling={false}
                            style={[styles.danhmuc, { paddingVertical: 10 }]}
                          >
                            Bạn chưa thêm dữ liệu nào
                          </Text>
                          {/* <ButtonChecklist
                            text={"Thêm mới"}
                            width={"auto"}
                            color={COLORS.bg_button}
                            onPress={handlePresentModalPress}
                          /> */}
                        </View>
                      </>
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
              // android_keyboardInputMode="adjustPan"
            >
               <View style={styles.contentContainer}>
                <ModalChecklist
                  ent_tang={ent_tang}
                  ent_khuvuc={ent_khuvuc}
                  ent_khoicv={ent_khoicv}
                  ent_toanha={ent_toanha}
                  hangMuc={hangMuc}
                  ent_calv={ent_calv}
                  handleChangeText={handleChangeText}
                  handleDataKhuvuc={handleDataKhuvuc}
                  handleChangeTextKhuVuc={handleChangeTextKhuVuc}
                  dataCheckKhuvuc={dataCheckKhuvuc}
                  dataInput={dataInput}
                  handlePushDataSave={handlePushDataSave}
                  isCheckUpdate={isCheckUpdate}
                  handlePushDataEdit={handlePushDataEdit}
                  activeKhuVuc={activeKhuVuc}
                  dataKhuVuc={dataKhuVuc}
                  loadingSubmit={loadingSubmit}
                  setCalvFilter={setCalvFilter}
                  calvFilter={calvFilter}
                />
              </View>
            </BottomSheetModal>

            {isCheckbox === true && newActionCheckList?.length > 0 && (
              <View
                style={{
                  width: 60,
                  position: "absolute",
                  right: 20,
                  bottom: 50,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {newActionCheckList?.length === 1 && (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleEditEnt(newActionCheckList[0])}
                    >
                      <Feather name="edit" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        handleToggleModal(true, newActionCheckList[0], 0.2)
                      }
                    >
                      <Feather name="eye" size={24} color="white" />
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAlertDelete(arrayId)}
                >
                  <Feather name="trash-2" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}

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
                  <View style={{ padding: 8 }}>
                    <Text allowFontScaling={false} style={styles.modalText}>
                      Thông tin checklist chi tiết
                    </Text>
                    <ModalChecklistInfo
                      dataModal={dataModal}
                      handleToggleModal={handleToggleModal}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleFilter}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleFilter(!modalVisibleFilter);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text allowFontScaling={false} style={styles.modalText}>
                    Tìm kiếm thông tin checklist
                  </Text>
                  <ModalChecklistFilter
                    dataModal={dataModal}
                    setModalVisibleFilter={setModalVisibleFilter}
                    isFilterData={isFilterData}
                    setIsFilterData={setIsFilterData}
                    handleFilterData={handleFilterData}
                    hangMuc={hangMuc}
                    ent_calv={ent_calv}
                    ent_khuvuc={ent_khuvuc}
                    ent_toanha={ent_toanha}
                    ent_khoicv={ent_khoicv}
                    ent_tang={ent_tang}
                    handleChangeFilter={handleChangeFilter}
                    handlePushDataCheck={handlePushDataCheck}
                    toggleSwitch={toggleSwitch}
                    handleCheckbox={handleCheckbox}
                    filters={filters}
                    isEnabled={isEnabled}
                  />
                </View>
              </View>
            </Modal>
          </ImageBackground>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}
    </GestureHandlerRootView>
  );
};

export default DanhmucChecklist;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
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
