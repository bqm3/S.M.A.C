import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { Provider, useDispatch, useSelector } from "react-redux";
import { loginChecklist, loginAssets } from "../redux/actions/authActions";
import { darkColors, lightColors } from "../constants/colors";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Checkbox from "../components/Checkbox/Checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import adjust from "../constants/adjust";
import ButtonSubmit from "../components/Button/ButtonSubmit";
import ThemeContext from "../context/ThemeContext";

// SplashScreen.preventAutoHideAsync();

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  // const { step, saveStep } = useContext(LoginContext);
  const {
    userChecklist,
    userAsset,
    messageChecklist,
    messageAsset,
    isLoadingAsset,
    isLoadingChecklist,
  } = useSelector((state) => state.authReducer);

  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState({
    UserName: "",
    Password: "",
  });


  const handleSubmit = async () => {
    if (data?.UserName === "" || data?.Password === "") {
      Alert.alert("PMC Thông báo", "Thiếu thông tin đăng nhập", [
        { text: "Xác nhận", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      dispatch(loginChecklist(data?.UserName, data?.Password));
      dispatch(loginAssets(data?.UserName, data?.Password));
    }
  };

  useEffect(() => {
    if (messageChecklist && messageAsset) {
      Alert.alert(
        "PMC Thông báo",
        "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!!",
        [{ text: "Xác nhận", onPress: () => console.log("OK Pressed") }]
      );
    }
  }, [messageAsset, messageChecklist]);

  useEffect(() => {
    const loadData = async () => {
      const savedUsername = await AsyncStorage.getItem("UserName");
      const savedPassword = await AsyncStorage.getItem("Password");
      if (savedUsername && savedPassword) {
        setData({
          UserName: savedUsername,
          Password: savedPassword,
        });
        setIsChecked(true);
      }
    };
    loadData();
  }, []);

  const handleToggle = async () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      await AsyncStorage.setItem("UserName", data?.UserName);
      await AsyncStorage.setItem("Password", data?.Password);
    } else {
      await AsyncStorage.removeItem("UserName");
      await AsyncStorage.removeItem("Password");
    }
  };

  const handleChangeText = (key, value) => {
    setData((data) => ({
      ...data,
      [key]: value,
    }));
  };


  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <ImageBackground
            source={require("../../assets/PMCONE2.png")}
            resizeMode="cover"
            style={styles.defaultFlex}
          >
            <ScrollView contentContainerStyle={[styles.container]}>
              {/* <Image
                style={{
                  width: adjust(140),
                  height: adjust(80),
                  resizeMode: "contain",
                }}
                source={require("../../assets/images/pmc_logo.png")}
              /> */}
              <View style={{ marginHorizontal: 20 }}>
                {/* <Title text={"Đăng nhập"} size={adjust(20)} top={30} /> */}

                <View
                  style={{
                    justifyContent: "flex-start",
                  }}
                >
                  <View style={{ height: adjust(20) }}></View>
                  <View style={styles.action}>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Nhập tài khoản"
                      placeholderTextColor={"black"}
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                      onChangeText={(val) => handleChangeText("UserName", val)}
                      defaultValue={data?.UserName}
                      autoCorrect={false}
                      secureTextEntry={false}
                      underLineColorAndroid="transparent"
                    />
                  </View>

                  <View style={styles.action}>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor={"black"}
                      style={[styles.textInput]}
                      autoCapitalize="sentences"
                      value={data?.Password}
                      onChangeText={(val) => handleChangeText("Password", val)}
                      secureTextEntry={!show}
                      // onSubmitEditing={() => handleSubmit()}
                    />
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => setShow(!show)}
                    >
                      {!show ? (
                        <Image
                          style={{
                            width: adjust(28),
                            height: adjust(28),
                            resizeMode: "contain",
                          }}
                          source={require("../../assets/icons/eye.png")}
                        />
                      ) : (
                        <Image
                          style={{
                            width: adjust(28),
                            height: adjust(28),
                            resizeMode: "contain",
                          }}
                          source={require("../../assets/icons/hidden.png")}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      isCheck={isChecked}
                      onPress={handleToggle}
                    />
                    <Text
                      allowFontScaling={false}
                      style={[styles.label, { textDecorationLine: "none" }]}
                    >
                      Lưu tài khoản và mật khẩu
                    </Text>
                  </View>

                  <View style={{ height: 20 }} />
                  <ButtonSubmit
                    backgroundColor={"black"}
                    text={"Đăng Nhập"}
                    isLoading={isLoadingAsset || isLoadingChecklist}
                    onPress={handleSubmit}
                    theme={theme}
                  />
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  defaultFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    color: "white",
    margin: 4,
    fontWeight: "700",
    textDecorationLine: "underline",
    textAlign: "center",

    fontSize: adjust(15),
  },
  action: {
    height: adjust(50),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  textInput: {
    paddingLeft: 12,
    color: "#05375a",
    width: "88%",

    fontSize: adjust(16),
    height: adjust(50),
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: adjust(14),
  },

  dropdown: {
    marginTop: 12,
    height: adjust(50),
    paddingHorizontal: 12,
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
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: adjust(16),
  },
  placeholderStyle: {
    fontSize: adjust(16),
    color: "#05375a",
  },
  selectedTextStyle: {
    fontSize: adjust(16),
    color: "#05375a",
  },
  iconStyle: {
    width: adjust(20),
    height: adjust(20),
  },
  inputSearchStyle: {
    height: adjust(40),
    fontSize: adjust(16),
  },
  paragraph: {
    fontSize: adjust(18),
    textAlign: "center",
  },
});
