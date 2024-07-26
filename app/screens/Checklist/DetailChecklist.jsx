import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
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
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import ActiveChecklist from "../../components/Active/ActiveCheckList";
import Button from "../../components/Button/Button";
import ModalPopupDetailChecklist from "../../components/Modal/ModalPopupDetailChecklist";
import moment from "moment";
import axios, { isCancel } from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import QRCodeScreen from "./QRCodeScreen";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";
import * as Network from "expo-network";
import adjust from "../../constants/adjust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "../../components/Active/Checkbox";

const DetailChecklist = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Hangmuc, hangMuc, Hangmuc } =
    route.params;
  const dispath = useDispatch();
  const { isLoadingDetail } = useSelector((state) => state.entReducer);
  const { setHangMuc, HangMucDefault, setHangMucDefault } =
    useContext(DataContext);
  const { dataChecklistFilterContext, setDataChecklistFilterContext } =
    useContext(ChecklistContext);
  const [isConnected, setIsConnected] = useState(false);

  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const [dataChecklistFilter, setDataChecklistFilter] = useState([]);
  const [newActionDataChecklist, setNewActionDataChecklist] = useState([]);
  const [defaultActionDataChecklist, setDefaultActionDataChecklist] = useState(
    []
  );
  const [dataChecklistFaild, setDataChecklistFaild] = useState([]);
  const [dataItem, setDataItem] = useState(null);
  const [tieuchuan, setTieuchuan] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  const [index, setIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTieuChuan, setModalVisibleTieuChuan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [activeAll, setActiveAll] = useState(false);

  useEffect(() => {
    const dataChecklist = dataChecklistFilterContext?.filter(
      (item) => item.ID_Hangmuc == ID_Hangmuc
    );

    const dataChecklistAction = dataChecklist.filter(
      (item) => item.valueCheck !== null
    );
    const dataChecklistDefault = dataChecklistAction.filter(
      (item) =>
        item.valueCheck === item.Giatridinhdanh &&
        item.GhichuChitiet === "" &&
        item.Anh === null
    );

    const dataChecklistActionWithoutDefault = dataChecklistAction.filter(
      (item) =>
        !dataChecklistDefault.some(
          (defaultItem) => defaultItem.ID_Checklist === item.ID_Checklist
        )
    );

    setDataChecklistFilter(dataChecklist);
    setNewActionDataChecklist(dataChecklistAction);
    setDefaultActionDataChecklist(dataChecklistDefault);
    setDataChecklistFaild(dataChecklistActionWithoutDefault);
  }, [dataChecklistFilterContext, ID_Hangmuc]);

  const handleChange = (key, value, it) => {
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item.ID_Checklist === it.ID_Checklist) {
        return {
          ...item,
          [key]: value,
          gioht: moment().format("LTS"),
        };
      }
      return item;
    });

      handleSetData(key, updatedDataChecklist, it);
    // }
  };

  const handleCheckAll = (value) => {
    setActiveAll(value);
    if (value) {
      const updateDataChecklist = dataChecklistFilter?.map((item, i) => {
        if (item.Tinhtrang == 0) {
          return {
            ...item,
            valueCheck: item.Giatridinhdanh,
            gioht: moment().format("LTS"),
          };
        } else {
          return {
            ...item,
            gioht: moment().format("LTS"),
          };
        }
      });

      const dataChecklistAction = updateDataChecklist.filter(
        (item) => item.valueCheck !== null
      );

      const dataChecklistDefault = dataChecklistAction.filter(
        (item) =>
          item.valueCheck === item.Giatridinhdanh &&
          item.GhichuChitiet === "" &&
          item.Anh === null
      );

      const dataChecklistActionWithoutDefault = updateDataChecklist.filter(
        (item) =>
          !dataChecklistDefault.some(
            (defaultItem) => defaultItem.ID_Checklist === item.ID_Checklist
          )
      );

      setDataChecklistFilter(updateDataChecklist);
      setNewActionDataChecklist(dataChecklistAction);
      setDefaultActionDataChecklist(dataChecklistDefault);
      setDataChecklistFaild(dataChecklistActionWithoutDefault);

      const data2Map = new Map(
        updateDataChecklist.map((item) => [item.ID_Checklist, item])
      );

      const updatedData1 = dataChecklistFilterContext.map((item) =>
        data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
      );
      setDataChecklistFilterContext(updatedData1);
    } else {
      const revertDataChecklist = dataChecklistFilter?.map((item) => {
        return {
          ...item,
          valueCheck: null,
          gioht: item.giohtBeforeUpdate || item.gioht, // Use a previous value or initial value if available
        };
      });

      setDataChecklistFilter(revertDataChecklist);
      setNewActionDataChecklist([]);
      setDefaultActionDataChecklist([]);
      setDataChecklistFaild([]);

     
    }
  };

  // set data checklist and image || ghichu
  const handleSetData = async (key, data, it) => {
    let mergedArrCheck = [...defaultActionDataChecklist];
    let mergedArrImage = [...dataChecklistFaild];

    // newDataChecklist là data được chọn.
    let newDataChecklist = data.filter((item) => item.valueCheck !== null);

    // Clear item checklist nếu valueCheck không phải là null
    if (it.valueCheck !== null) {
      if (key === "option") {
        const indexFaild = newDataChecklist.findIndex((item) => {
          return (
            item.ID_Checklist === it.ID_Checklist &&
            item.Giatridinhdanh === item.valueCheck &&
            it.Anh === null &&
            it.GhichuChitiet === ""
          );
        });

        if (indexFaild === -1) {
          if (
            !mergedArrImage.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrImage.push(it);
          }
          const indexDefault = mergedArrCheck.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );
          if (indexDefault !== -1) {
            mergedArrCheck.splice(indexDefault, 1);
          }
        } else {
          if (
            !mergedArrCheck.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrCheck.push(it);
          }
          const indexDefault = mergedArrImage.findIndex(
            (item) => item.ID_Checklist === it.ID_Checklist
          );
          if (indexDefault !== -1) {
            mergedArrImage.splice(indexDefault, 1);
          }
        }
      } else if (key === "active") {
        const indexFaild = mergedArrImage.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (indexFaild !== -1) {
          mergedArrImage.splice(indexFaild, 1);
        }
        const indexDefault = mergedArrCheck.findIndex(
          (item) => item.ID_Checklist === it.ID_Checklist
        );
        if (indexDefault !== -1) {
          mergedArrCheck.splice(indexDefault, 1);
        }
      }
    } else {
      if (key === "option" || key === "active") {
        const indexFaild = newDataChecklist.find(
          (item) =>
            item.ID_Checklist === it.ID_Checklist &&
            item.valueCheck !== item.Giatridinhdanh
        );

        if (indexFaild) {
          if (
            !mergedArrImage.some(
              (existingItem) => existingItem.ID_Checklist === it.ID_Checklist
            )
          ) {
            mergedArrImage.push(it);
          }

          const indexCheck = mergedArrCheck.findIndex((item) => {
            return (
              item.ID_Checklist === it.ID_Checklist &&
              it.valueCheck === item.valueCheck &&
              it.Anh === null &&
              it.GhichuChitiet === ""
            );
          });
          if (indexCheck !== -1) {
            mergedArrCheck.splice(indexCheck, 1);
          }
        } else {
          const found = mergedArrCheck.some(
            (existingItem) =>
              it.ID_Checklist === existingItem.ID_Checklist &&
              item.Giatridinhdanh === existingItem.valueCheck &&
              it.Anh === null &&
              it.GhichuChitiet === ""
          );
          if (!found) {
            mergedArrCheck.push(it);
          }
        }
      }
    }

    setDataChecklistFaild([...mergedArrImage]);
    setDefaultActionDataChecklist(mergedArrCheck);
    setNewActionDataChecklist([...mergedArrImage, ...mergedArrCheck]);
    setDataChecklistFilter(data);

    const data2Map = new Map(data.map((item) => [item.ID_Checklist, item]));

    const updatedData1 = dataChecklistFilterContext.map((item) =>
      data2Map.has(item.ID_Checklist) ? data2Map.get(item.ID_Checklist) : item
    );
    setDataChecklistFilterContext(updatedData1);
  };

  // click item checklist
  const handleItemClick = (value, it, key) => {
    const updatedDataChecklist = dataChecklistFilter?.map((item, i) => {
      if (item.ID_Checklist === it.ID_Checklist && key === "option") {
        return {
          ...item,
          valueCheck: value ? value : null,
          gioht: moment().format("LTS"),
        };
      } else if (item.ID_Checklist === it.ID_Checklist && key === "active") {
        return {
          ...item,
          valueCheck: value ? value : null,
          gioht: moment().format("LTS"),
        };
      }
      return item;
    });

    handleSetData(key, updatedDataChecklist, it);
  };

  const handlePushDataFilterQr = async (value) => {
    const data = {
      MaQrCode: value,
    };
    try {
      const res = await axios.post(
        BASE_URL_CHECKLIST + `/ent_checklist/filter_qr/${ID_KhoiCV}/${ID_ChecklistC}`,
        data,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + authTokenChecklist,
          },
        }
      );
      const dataList = res.data.data;
      let filteredData = dataList.map((item) => {
        const matchingItem = defaultActionDataChecklist.find((newItem) => {
          return newItem.ID_Checklist === item.ID_Checklist;
        });
        if (matchingItem) {
          return {
            ...item,
            valueCheck: matchingItem.valueCheck,
            GhichuChitiet: matchingItem.GhichuChitiet,
            Anh: matchingItem.Anh,
            gioht: matchingItem.gioht,
            ID_ChecklistC: ID_ChecklistC,
          };
        } else {
          return {
            ...item,
            valueCheck: null,
            GhichuChitiet: "",
            Anh: null,
            gioht: moment().format("LTS"),
            ID_ChecklistC: ID_ChecklistC,
          };
        }
      });

      const newDataChecklist = filteredData.filter(
        (item) => item.valueCheck !== null
      );

      // Thêm các phần tử mới từ newDataChecklist vào newActionDataChecklist
      setNewActionDataChecklist((prevState) =>
        prevState?.concat(newDataChecklist)
      );

      setDataChecklistFilter(filteredData);
      setOpacity(1);
      setModalVisibleQr(false);
      handleCloseModal();
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

  // call api submit data checklsit
  const handleSubmit = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);

      if (networkState.isConnected) {
        setLoadingSubmit(true);
        setActiveAll(false)
        if (
          defaultActionDataChecklist.length === 0 &&
          dataChecklistFaild.length === 0
        ) {
          // Hiển thị thông báo cho người dùng
          Alert.alert("PMC Thông báo", "Không có checklist để kiểm tra!", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
          setLoadingSubmit(false);
          // Kết thúc hàm sớm nếu mảng rỗng
          return;
        }
        // Kiểm tra dữ liệu và xử lý tùy thuộc vào trạng thái của `defaultActionDataChecklist` và `dataChecklistFaild`
        if (
          defaultActionDataChecklist.length === 0 &&
          dataChecklistFaild.length > 0
        ) {
          // Xử lý API cho dataChecklistFaild
          await handleDataChecklistFaild();
        } else if (
          defaultActionDataChecklist.length > 0 &&
          dataChecklistFaild.length == 0
        ) {
          // Xử lý API cho defaultActionDataChecklist
          await handleDefaultActionDataChecklist();
        }

        if (
          defaultActionDataChecklist.length > 0 &&
          dataChecklistFaild.length > 0
        ) {
          await hadlChecklistAll();
          setLoadingSubmit(false);
        }
      } else {
        Alert.alert(
          "Không có kết nối mạng",
          "Vui lòng kiểm tra kết nối mạng của bạn."
        );
        await AsyncStorage.setItem("checkNetwork", "1");
      }
    } catch (error) {
      // Cập nhật sau khi hoàn thành xử lý API} catch (error) {
      console.error("Lỗi khi kiểm tra kết nối mạng:", error);
    }
  };

  // api faild tb_checklistchitiet
  const handleDataChecklistFaild = async () => {
    try {
      setLoadingSubmit(true);
      // Create a new FormData instance
      const formData = new FormData();

      // Iterate over all items in dataChecklistFaild
      dataChecklistFaild.forEach((item, index) => {
        // Extract and append checklist details to formData
        formData.append("ID_ChecklistC", ID_ChecklistC);
        formData.append("ID_Checklist", item.ID_Checklist);
        formData.append("Ketqua", item.valueCheck || "");
        formData.append("Gioht", item.gioht);
        formData.append("Ghichu", item.GhichuChitiet || "");

        // If there is an image, append it to formData
        if (item.Anh) {
          const file = {
            uri:
              Platform.OS === "android"
                ? item.Anh.uri
                : item.Anh.uri.replace("file://", ""),
            name:
              item.Anh.fileName ||
              `${Math.floor(Math.random() * 999999999)}.jpg`,
            type: "image/jpeg",
          };
          formData.append(`Images_${index}`, file);
          formData.append("Anh", file.name);
        } else {
          formData.append("Anh", "");
          formData.append(`Images_${index}`, {});
        }
      });

      // Send the entire FormData in a single request
      await axios
        .post(BASE_URL_CHECKLIST + `/tb_checklistchitiet/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokenChecklist}`,
          },
        })
        .then((res) => {
          postHandleSubmit();
          setLoadingSubmit(false);
          Alert.alert("PMC Thông báo", "Checklist thành công", [
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
          Alert.alert(
            "PMC Thông báo",
            "Checklist thất bại. Vui lòng kiểm tra lại hình ảnh hoặc ghi chú!!!",
            [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
          );
        });
    } catch (error) {
      setLoadingSubmit(false);
      if (error.response) {
        // Handle error response from the server
        Alert.alert("PMC Thông báo", error.response.data.message, [
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

  // api faild tb_checklistchitietdone
  const handleDefaultActionDataChecklist = async () => {
    // Xử lý API cho defaultActionDataChecklist
    const descriptions = [
      defaultActionDataChecklist
        .map(
          (item) => `${item.ID_Checklist}/${item.Giatridinhdanh}/${item.gioht}`
        )
        .join(","),
    ];
    const ID_Checklists = defaultActionDataChecklist.map(
      (item) => item.ID_Checklist
    );
    const descriptionsJSON = JSON.stringify(descriptions);

    const requestDone = axios.post(
      BASE_URL_CHECKLIST + "/tb_checklistchitietdone/create",
      {
        Description: descriptionsJSON,
        ID_Checklists: ID_Checklists,
        ID_ChecklistC: ID_ChecklistC,
        checklistLength: defaultActionDataChecklist.length,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      }
    );
    try {
      // Gộp cả hai mảng promise và đợi cho tất cả các promise hoàn thành
      await Promise.all(requestDone);
      postHandleSubmit();
      setLoadingSubmit(false);
      // Hiển thị cảnh báo sau khi tất cả các yêu cầu hoàn thành
      Alert.alert("PMC Thông báo", "Checklist thành công", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);

      // Thiết lập lại dữ liệu và cờ loading
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
      }
    }
  };

  // api all
  const hadlChecklistAll = async () => {
    try {
      // Tạo một đối tượng FormData để chứa dữ liệu của dataChecklistFaild
      const formData = new FormData();
  
      // Lặp qua từng phần tử trong dataChecklistFaild để thêm vào FormData
      dataChecklistFaild.forEach((item, index) => {
        formData.append("ID_ChecklistC", ID_ChecklistC);
        formData.append("ID_Checklist", item.ID_Checklist);
        formData.append("Ketqua", item.valueCheck || "");
        formData.append("Gioht", item.gioht);
        formData.append("Ghichu", item.GhichuChitiet || "");
  
        // Nếu có hình ảnh, thêm vào FormData
        if (item.Anh) {
          const file = {
            uri: Platform.OS === "android" ? item.Anh.uri : item.Anh.uri.replace("file://", ""),
            name: item.Anh.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
            type: "image/jpeg",
          };
          formData.append(`Images_${index}`, file);
          formData.append("Anh", file.name);
        } else {
          formData.append("Anh", "");
          formData.append(`Images_${index}`, {});
        }
      });
  
      // Chuẩn bị dữ liệu cho yêu cầu thứ hai
      const descriptions = [
        defaultActionDataChecklist
          .map((item) => `${item.ID_Checklist}/${item.Giatridinhdanh}/${item.gioht}`)
          .join(","),
      ];
      const descriptionsJSON = JSON.stringify(descriptions);
      const ID_Checklists = defaultActionDataChecklist.map((item) => item.ID_Checklist);
  
      // Tạo các yêu cầu API
      const requestFaild = axios.post(`${BASE_URL_CHECKLIST}/tb_checklistchitiet/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authTokenChecklist}`,
        },
      });
  
      const requestDone = axios.post(
        `${BASE_URL_CHECKLIST}/tb_checklistchitietdone/create`,
        {
          Description: descriptionsJSON,
          ID_Checklists: ID_Checklists,
          ID_ChecklistC: ID_ChecklistC,
          checklistLength: defaultActionDataChecklist.length,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authTokenChecklist}`,
          },
        }
      );
  
      // Gọi cả hai API cùng lúc
      axios.all([requestFaild, requestDone])
        .then(axios.spread((faildResponse, doneResponse) => {
          console.log(faildResponse.data, doneResponse.data);
  
          postHandleSubmit();
          setLoadingSubmit(false);
          
          // Hiển thị thông báo thành công
          Alert.alert("PMC Thông báo", "Checklist thành công", [
            {
              text: "Hủy",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
          ]);
        }))
        .catch(error => {
          setLoadingSubmit(false);
          
          if (error.response) {
            // Xử lý lỗi từ server
            Alert.alert("PMC Thông báo", error.response.data.message, [
              {
                text: "Hủy",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
            ]);
          } else if (error.request) {
            // Xử lý lỗi yêu cầu (không nhận được phản hồi từ server)
            console.error('Request error:', error.request);
            Alert.alert("PMC Thông báo", "Network error. Please try again later.", [
              {
                text: "Hủy",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
            ]);
          } else {
            // Xử lý các lỗi khác
            console.error('Error:', error.message);
            Alert.alert("PMC Thông báo", "An error occurred. Please try again later.", [
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
      setLoadingSubmit(false);
      console.error('Error:', error.message);
      Alert.alert("PMC Thông báo", "An error occurred. Please try again later.", [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };
  
  

  // view item flatlist
  const renderItem = (item, index) => {
    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor: `${item?.Tinhtrang}` === "1" ? "#ea9999" : "white",
          },
        ]}
        key={item?.ID_Checklist}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ActiveChecklist
              item={item}
              index={index}
              size={adjust(30)}
              handleToggle={() =>
                handleItemClick(item?.Giatridinhdanh, item, "active")
              }
              // active={}
            />
            <View style={{ width: "90%" }}>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: adjust(16),
                  color: "black",
                  fontWeight: "600",
                }}
                numberOfLines={5}
              >
                {item?.Sothutu}. {item?.Checklist}
              </Text>
            </View>
          </View>

          <View
            style={{
              // width: "25%",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => handlePopupActiveTieuChuan(item, index)}
            >
              <MaterialIcons name="read-more" size={adjust(30)} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePopupActive(item, index)}>
              <Entypo
                name="dots-three-vertical"
                size={adjust(30)}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Thiết lập lại dữ liệu sau khi hoàn thành xử lý API
  const postHandleSubmit = () => {
    const idsToRemove = new Set([
      ...defaultActionDataChecklist.map((item) => item.ID_Checklist),
      ...dataChecklistFaild.map((item) => item.ID_Checklist),
    ]);

    // Filter out items in dataChecklistFilterContext that are present in idsToRemove
    const dataChecklistFilterContextReset = dataChecklistFilterContext.filter(
      (item) => !idsToRemove.has(item.ID_Checklist)
    );

    if (dataChecklistFilter?.length === newActionDataChecklist?.length) {
      const filteredData = hangMuc.filter(
        (item) => item.ID_Hangmuc !== ID_Hangmuc
      );
      const filteredDataDefault = HangMucDefault.filter(
        (item) => item.ID_Hangmuc !== ID_Hangmuc
      );
      setHangMucDefault(filteredDataDefault);

      setHangMuc(filteredData);
      navigation.goBack();
    }

    // Update state with the filtered context
    setDataChecklistFilterContext(dataChecklistFilterContextReset);

    // Optionally, reset newActionDataChecklist, defaultActionDataChecklist, and dataChecklistFaild if needed
    setNewActionDataChecklist([]);
    setDefaultActionDataChecklist([]);
    setDataChecklistFaild([]);
  };

  // close modal bottomsheet
  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.close();
    setOpacity(1);
  };

  // click dots and show modal bottom sheet
  const handlePopupActive = useCallback((item, index) => {
    setOpacity(0.2);
    setDataItem(item);
    setModalVisible(true);
    setIndex(index);
  }, []);

  const handlePopupActiveTieuChuan = useCallback((item, index) => {
    setOpacity(0.2);
    setTieuchuan(item.Tieuchuan);
    setModalVisibleTieuChuan(true);
    setIndex(index);
  });

  // close modal bottom sheet
  const handlePopupClear = useCallback(() => {
    setOpacity(1);
    setDataItem(null);
    setModalVisible(false);
    setIndex(null);
  }, []);

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
                        <Text
                          allowFontScaling={false}
                          style={[styles.text, { fontSize: 17 }]}
                        >
                          Hạng mục: {Hangmuc}
                        </Text>
                        <Text allowFontScaling={false} style={styles.text}>
                          Số lượng: {decimalNumber(dataChecklistFilter?.length)}{" "}
                          Checklist
                        </Text>
                        <Text allowFontScaling={false} style={styles.text}>
                          Đang checklist:{" "}
                          {decimalNumber(newActionDataChecklist?.length)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 12,
                  }}
                >
                  <Checkbox
                    isCheck={activeAll}
                    onPress={() => handleCheckAll(!activeAll)}
                    size={30}
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.text,
                      { paddingHorizontal: 12, fontSize: adjust(18) },
                    ]}
                  >
                    Chọn tất cả
                  </Text>
                </View>

                {isLoadingDetail === false &&
                  dataChecklistFilter &&
                  dataChecklistFilter?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={dataChecklistFilter}
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

                {isLoadingDetail === true &&
                  dataChecklistFilter?.length == 0 && (
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

                {isLoadingDetail === false &&
                  dataChecklistFilter?.length == 0 && (
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
                          ? "Không thấy checklist cho hạng mục này"
                          : "Không còn checklist cho hạng mục này !"}
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
                  <Button
                    text={"Hoàn Thành"}
                    isLoading={loadingSubmit}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => handleSubmit()}
                  />
                </View>
              </View>
            </ImageBackground>

            {/* Modal show action  */}
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
                    Thông tin checklist chi tiết
                  </Text>
                  <ModalPopupDetailChecklist
                    handlePopupClear={handlePopupClear}
                    dataItem={dataItem}
                    handleItemClick={handleItemClick}
                    index={index}
                    handleChange={handleChange}
                  />
                </View>
              </View>
            </Modal>

            {/* Modal show tieu chuan  */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisibleTieuChuan}
              onRequestClose={() => {
                setModalVisibleTieuChuan(!modalVisibleTieuChuan);
              }}
            >
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      width: "60%",
                      height: "auto",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <ScrollView>
                    <Text
                      allowFontScaling={false}
                      style={{ paddingBottom: 30 }}
                    >
                      {tieuchuan}{" "}
                    </Text>
                  </ScrollView>
                  <Button
                    text={"Đóng"}
                    backgroundColor={COLORS.bg_button}
                    color={"white"}
                    onPress={() => {
                      setModalVisibleTieuChuan(false);
                      setOpacity(1);
                    }}
                  />
                </View>
              </View>
            </Modal>

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
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default DetailChecklist;

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  danhmuc: {
    fontSize: adjust(25),
    fontWeight: "700",
    color: "white",
  },
  text: { fontSize: adjust(15), color: "white", fontWeight: "600" },
  headerTable: {
    color: "white",
  },
  outter: {
    width: adjust(20),
    height: adjust(20),
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
    padding: 10,
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
