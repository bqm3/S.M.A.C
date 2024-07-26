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
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ent_khuvuc_get,
  ent_toanha_get,
  ent_checklist_mul_hm,
} from "../../redux/actions/entActions";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import axios from "axios";
import moment from "moment";
import { BASE_URL_CHECKLIST } from "../../constants/config";
import QRCodeScreen from "./QRCodeScreen";
import DataContext from "../../context/DataContext";
import ChecklistContext from "../../context/ChecklistContext";
import adjust from "../../constants/adjust";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";

const ThucHienKhuvuc = ({ route, navigation }) => {
  const { ID_ChecklistC, ID_KhoiCV, ID_Calv, ID_Toanha, ID_Khuvucs } =
    route.params;

  const { setDataChecklists, dataHangmuc, setStepKhuvuc, stepKhuvuc } =
    useContext(DataContext);
  const { setDataChecklistFilterContext, dataChecklistFilterContext } =
    useContext(ChecklistContext);

  const dispath = useDispatch();
  const { ent_khuvuc, ent_checklist_detail, ent_toanha } = useSelector(
    (state) => state.entReducer
  );

  const { userChecklist, authTokenChecklist } = useSelector((state) => state.authReducer);

  const [opacity, setOpacity] = useState(1);
  const [submit, setSubmit] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [modalVisibleQr, setModalVisibleQr] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [data, setData] = useState([]);

  const [defaultActionDataChecklist, setDefaultActionDataChecklist] = useState(
    []
  );
  const [dataChecklistFaild, setDataChecklistFaild] = useState([]);

  const [checkKhuvuc, setCheckKhuvuc] = useState([]);
  // const toanhaIds = checkKhuvuc.map((item) => item.ID_Toanha);

  const init_checklist = async () => {
    await dispath(ent_checklist_mul_hm(dataHangmuc, ID_Calv, ID_ChecklistC));
  };

  useEffect(() => {
    const ID_KhuvucsArray = Array.isArray(ID_Khuvucs)
      ? ID_Khuvucs
      : ID_Khuvucs.split(",").map(Number);
    setStepKhuvuc(1);
    // Kiểm tra xem mảng ent_khuvuc có dữ liệu không
    if (ent_khuvuc && ent_khuvuc.length > 0) {
      const matchingEntKhuvuc = ent_khuvuc.filter((item) =>
        // Kiểm tra xem ID_Khuvuc có nằm trong mảng ID_KhuvucsArray không
        ID_KhuvucsArray.includes(item.ID_Khuvuc)
      );
      setData(matchingEntKhuvuc);
    } else {
    }
  }, [ID_Khuvucs, ent_khuvuc]);

  useEffect(() => {
    const dataChecklistAction = dataChecklistFilterContext.filter(
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

    setDefaultActionDataChecklist(dataChecklistDefault);
    setDataChecklistFaild(dataChecklistActionWithoutDefault);
  }, [dataChecklistFilterContext]);

  useEffect(() => {
    const fetchNetworkStatus = async () => {
      try {
        // Retrieve the item from AsyncStorage
        const network = await AsyncStorage.getItem("checkNetwork");
        if (network === "1") {
          setSubmit(true);
        }

        if (network === null) {
          console.log("Network status not found in storage.");
          setSubmit(false);
        }
      } catch (error) {
        // Handle any errors that occur
        console.log("Error fetching network status:", error);
        setSubmit(false);
      }
    };

    // Call the async function
    fetchNetworkStatus();
  }, [dataChecklistFilterContext]);

  useEffect(() => {
    init_checklist();
  }, [dataHangmuc]);

  useEffect(() => {
    if (ent_checklist_detail) {
      setDataChecklists(ent_checklist_detail);
      setDataChecklistFilterContext(ent_checklist_detail);
    }
  }, [ent_checklist_detail]);

  const handlePushDataFilterQr = async (value) => {
    const cleanedValue = value
      .replace(/^http:\/\//, "")
      .trim()
      .toLowerCase();

    try {
      const resData = ent_khuvuc.filter(
        (item) => item.MaQrCode.trim().toLowerCase() === cleanedValue
      );
      if (resData.length >= 1) {
        navigation.navigate("Thực hiện hạng mục", {
          ID_ChecklistC: ID_ChecklistC,
          ID_KhoiCV: ID_KhoiCV,
          ID_Calv: ID_Calv,
          ID_Khuvuc: resData[0].ID_Khuvuc,
        });
        setIsScan(false);
        setModalVisibleQr(false);
        setOpacity(1);
      } else if (resData.length === 0) {
        Alert.alert(
          "PMC Thông báo",
          "Không tìm thấy khu vực có mã Qr phù hợp",
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

  const toggleSelectToanha = async (item) => {
    setCheckKhuvuc((prevDataSelect) => {
      // Kiểm tra xem item đã tồn tại trong mảng chưa
      const isExist = prevDataSelect.includes(item);

      // Nếu item đã tồn tại, xóa item đó đi
      if (isExist) {
        return prevDataSelect.filter((existingItem) => existingItem !== item);
      } else {
        // Nếu item chưa tồn tại, thêm vào mảng
        return [...prevDataSelect, item];
      }
    });
  };

  const handleSubmit = () => {
    navigation.navigate("Thực hiện hạng mục", {
      ID_ChecklistC: ID_ChecklistC,
      ID_KhoiCV: ID_KhoiCV,
      ID_Calv: ID_Calv,
      ID_Khuvuc: dataSelect[0].ID_Khuvuc,
    });
    setDataSelect([]);
  };

  const handleSubmitChecklist = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected) {
        setLoadingSubmit(true);
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
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(async (res) => {
          await AsyncStorage.removeItem("checkNetwork");
          setSubmit(false);
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
      await AsyncStorage.removeItem("checkNetwork");
      setSubmit(false);
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
    // Tạo một đối tượng FormData để chứa dữ liệu của dataChecklistFaild
    const formData = new FormData();

    // Lặp qua từng phần tử trong dataChecklistFaild để thêm vào FormData
    dataChecklistFaild.forEach((item, index) => {
      // Thêm các trường dữ liệu vào FormData
      formData.append("ID_ChecklistC", ID_ChecklistC);
      formData.append("ID_Checklist", item.ID_Checklist);
      formData.append("Ketqua", item.valueCheck || "");
      formData.append("Gioht", item.gioht);
      formData.append("Ghichu", item.GhichuChitiet || "");

      // Nếu có hình ảnh, thêm vào FormData
      if (item.Anh) {
        const file = {
          uri:
            Platform.OS === "android"
              ? item.Anh.uri
              : item.Anh.uri.replace("file://", ""),
          name:
            item.Anh.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
          type: "image/jpeg",
        };
        formData.append(`Images_${index}`, file);
        formData.append("Anh", file.name);
      } else {
        formData.append("Anh", "");
        formData.append(`Images_${index}`, {});
      }
    });

    // Gửi FormData trong một yêu cầu duy nhất
    const requestFaild = axios.post(
      BASE_URL_CHECKLIST + `/tb_checklistchitiet/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authTokenChecklist,
        },
      }
    );

    // Chuẩn bị dữ liệu cho yêu cầu thứ hai
    const descriptions = [
      defaultActionDataChecklist
        .map(
          (item) => `${item.ID_Checklist}/${item.Giatridinhdanh}/${item.gioht}`
        )
        .join(","),
    ];
    const descriptionsJSON = JSON.stringify(descriptions);
    const ID_Checklists = defaultActionDataChecklist.map(
      (item) => item.ID_Checklist
    );

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
      // Gộp các promise lại và chờ cho tất cả các promise hoàn thành
      await Promise.all([requestFaild, requestDone]);
      await AsyncStorage.removeItem("checkNetwork");
      setSubmit(false);
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

      // Thiết lập lại dữ liệu và trạng thái loading
    } catch (error) {
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
      }
    }
  };

  const handleSubmitKhuvuc = async () => {
    const data = {
      ID_ChecklistC: ID_ChecklistC,
      toanhaIds: toanhaIds.join(", "),
      ID_Calv: ID_Calv,
      ID_User: userChecklist.ID_User,
    };

    await axios
      .post(BASE_URL_CHECKLIST + "/tb_checklistc/toanha", data, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + authTokenChecklist,
        },
      })
      .then((res) => {
        setLoadingSubmit(false);
        setStepKhuvuc(1);
        // Hiển thị cảnh báo sau khi tất cả các yêu cầu hoàn thành
        Alert.alert("PMC Thông báo", "Chọn khu vực thành công", [
          {
            text: "Hủy",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .catch((error) => {
        setStepKhuvuc(0);
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
      });
  };

  const postHandleSubmit = () => {
    const idsToRemove = new Set([
      ...defaultActionDataChecklist.map((item) => item.ID_Checklist),
      ...dataChecklistFaild.map((item) => item.ID_Checklist),
    ]);

    // Filter out items in dataChecklistFilterContext that are present in idsToRemove
    const dataChecklistFilterContextReset = dataChecklistFilterContext.filter(
      (item) => !idsToRemove.has(item.ID_Checklist)
    );

    // Update state with the filtered context
    setDataChecklistFilterContext(dataChecklistFilterContextReset);
    setDefaultActionDataChecklist([]);
    setDataChecklistFaild([]);
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
            width: "80%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: dataSelect[0] === item ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Tenkhuvuc} - {item?.ent_toanha?.Toanha}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemToanha = (item, index) => {
    const isCheck = checkKhuvuc.includes(item);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectToanha(item)}
        onLongPress={() => handleSubmit()}
        style={[
          styles.content,
          {
            backgroundColor: isCheck ? COLORS.bg_button : "white",
          },
        ]}
        key={index}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "80%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              fontSize: adjust(16),
              color: isCheck ? "white" : "black",
              fontWeight: "600",
            }}
            numberOfLines={5}
          >
            {item?.Toanha}
          </Text>
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
              {stepKhuvuc == 1 ? (
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
                          <Text
                            allowFontScaling={false}
                            style={[styles.text, { fontSize: adjust(18) }]}
                          >
                            Số lượng: {decimalNumber(data?.length)} khu vực
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isLoadingDetail === false && data && data?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={data}
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

                  {isLoadingDetail === true && ent_khuvuc?.length == 0 && (
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

                  {isLoadingDetail === false && ent_khuvuc?.length == 0 && (
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
                          ? "Không thấy khu vực này"
                          : "Không có khu vực trong ca làm việc này !"}
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
                      text={"Scan QR Code"}
                      backgroundColor={"white"}
                      color={"black"}
                      onPress={() => {
                        setModalVisibleQr(true);
                        setOpacity(0.2);
                      }}
                    />
                    {dataSelect[0] && (
                      <Button
                        text={"Vào khu vực"}
                        isLoading={loadingSubmit}
                        backgroundColor={COLORS.bg_button}
                        color={"white"}
                        onPress={() => handleSubmit()}
                      />
                    )}

                    {submit === true && (
                      <Button
                        text={"Checklist tất cả"}
                        isLoading={loadingSubmit}
                        backgroundColor={COLORS.bg_button}
                        color={"white"}
                        onPress={() => handleSubmitChecklist()}
                      />
                    )}
                  </View>
                </View>
              ) : (
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
                          <Text
                            allowFontScaling={false}
                            style={[styles.text, { fontSize: adjust(18) }]}
                          >
                            Số lượng: {decimalNumber(ent_toanha?.length)} tòa
                            nhà
                          </Text>
                          <Text
                            allowFontScaling={false}
                            style={[styles.text, { fontSize: 14 }]}
                          >
                            Chọn từ 1 tòa nhà trở lên với mỗi nhân viên đi
                            checklist.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {ent_toanha && ent_toanha?.length > 0 && (
                    <>
                      <FlatList
                        style={{
                          margin: 12,
                          flex: 1,
                          marginBottom: 100,
                        }}
                        data={ent_toanha}
                        renderItem={({ item, index, separators }) =>
                          renderItemToanha(item, index)
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
                    {checkKhuvuc.length > 0 && (
                      <Button
                        text={"Chọn khu vực"}
                        backgroundColor={COLORS.bg_button}
                        color={"white"}
                        onPress={() => handleSubmitKhuvuc()}
                      />
                    )}
                  </View>
                </View>
              )}
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
          </BottomSheetModalProvider>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ThucHienKhuvuc;

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
