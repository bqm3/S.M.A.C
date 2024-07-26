import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import React, { useRef, useState, useEffect } from "react";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import Button from "../Button/Button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const ModalChecklistCImage = ({
  handlePushDataSave,
  isLoading,
  handleChangeImages,
  dataImages,
  handlePushDataImagesSave,
  newActionCheckList,
}) => {
  const date = new Date();
  const dateHour = moment(date).format("LTS");
  const [image1, setImage1] = useState(newActionCheckList[0]?.Anh1);
  const [image2, setImage2] = useState(newActionCheckList[0]?.Anh2);
  const [image3, setImage3] = useState(newActionCheckList[0]?.Anh3);
  const [image4, setImage4] = useState(newActionCheckList[0]?.Anh4);
  const [openImage1, setOpenImage1] = useState(false);
  const [openImage2, setOpenImage2] = useState(false);
  const [openImage3, setOpenImage3] = useState(false);
  const [openImage4, setOpenImage4] = useState(false);

  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const pickImage = async (text, hour, onPress, setOpen) => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Adjust image quality (0 to 1)
    });

    if (!result.cancelled) {
      const assetFile = result?.assets[0];
      handleChangeImages(text, assetFile);
      handleChangeImages(hour, dateHour);
      onPress(assetFile);
      setOpen(true);
    }
  };

  const onPressLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Get the current location
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    // Convert location to address
    let { coords } = currentLocation;
    let reverseGeocodedAddress = await Location.reverseGeocodeAsync(coords);
    setAddress(reverseGeocodedAddress);
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const handleWebView = (image) => {
    setModalVisible(true);
    setImage(image);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View style={{ margin: 20 }}>
          <View style={{ justifyContent: "space-around", width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false}  style={styles.text}>
                  Ảnh 1
                </Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,

                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() => {
                      pickImage(
                        "Anh1",
                        "Giochupanh1",
                        setImage1,
                        setOpenImage1
                      );
                      onPressLocation();
                    }}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>

                  {image1 !== null && openImage1 === true && (
                    <Image
                      source={{ uri: image1.uri ? image1.uri : image1 }}
                      style={styles.image}
                    />
                  )}
                  {image1 === null && <></>}
                  {image1 !== null && openImage1 === false && (
                    <TouchableOpacity
                      style={styles.buttonImage}
                      onPress={() => handleWebView(image1)}
                    >
                      <Text allowFontScaling={false}  style={styles.textImage}>
                        Xem ảnh
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false}  style={styles.text}>
                  Ảnh 2
                </Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() => {
                      pickImage(
                        "Anh2",
                        "Giochupanh2",
                        setImage2,
                        setOpenImage2
                      );
                      onPressLocation();
                    }}
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image2 !== null && openImage2 === true && (
                    <Image
                      source={{ uri: image2.uri ? image2.uri : image2 }}
                      style={styles.image}
                    />
                  )}
                  {image2 === null && <></>}
                  {image2 !== null && openImage2 === false && (
                    <TouchableOpacity
                      style={styles.buttonImage}
                      onPress={() => handleWebView(image2)}
                    >
                      <Text allowFontScaling={false}  style={styles.textImage}>
                        Xem ảnh
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false}  style={styles.text}>
                  Ảnh 3
                </Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,

                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() =>
                      pickImage("Anh3", "Giochupanh3", setImage3, setOpenImage3)
                    }
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image3 !== null && openImage3 === true && (
                    <Image
                      source={{ uri: image3.uri ? image3.uri : image3 }}
                      style={styles.image}
                    />
                  )}
                  {image3 === null && <></>}
                  {image3 !== null && openImage3 === false && (
                    <TouchableOpacity
                      style={styles.buttonImage}
                      onPress={() => handleWebView(image3)}
                    >
                      <Text allowFontScaling={false}  style={styles.textImage}>
                        Xem ảnh
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={{ width: "48%" }}>
                <Text allowFontScaling={false}  style={styles.text}>
                  Ảnh 4
                </Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: SIZES.padding,
                      borderRadius: SIZES.borderRadius,
                      borderColor: COLORS.bg_button,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                    }}
                    onPress={() =>
                      pickImage("Anh4", "Giochupanh4", setImage4, setOpenImage4)
                    }
                  >
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                  {image4 !== null && openImage4 === true && (
                    <Image
                      source={{ uri: image4.uri ? image4.uri : image4 }}
                      style={styles.image}
                    />
                  )}
                  {image4 === null && <></>}
                  {image4 !== null && openImage4 === false && (
                    <TouchableOpacity
                      style={styles.buttonImage}
                      onPress={() => handleWebView(image4)}
                    >
                      <Text allowFontScaling={false}  style={styles.textImage}>
                        Xem ảnh
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                text={"Lưu"}
                width={"auto"}
                backgroundColor={COLORS.bg_button}
                color={"white"}
                isLoading={isLoading}
                onPress={() => handlePushDataImagesSave(1)}
              />
            </View>
          </View>
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
                Hình ảnh checklist
              </Text>

              <Image
                style={{
                  width: '90%',
                  height: '90%',
                  resizeMode: "cover",
                  justifyContent: "center",
                  alignContent: "center",
                }}
                source={{
                  uri: `https://drive.google.com/thumbnail?id=${image}&sz=w1000`,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setImage(null);
              }}
              style={styles.buttonImage}
            >
              <Text allowFontScaling={false}  style={styles.textImage}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ModalChecklistCImage;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textInput: {
    color: "#05375a",
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  dropdown: {
    height: 48,
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
  selectedTextStyle: {
    // color: COLORS.bg_button,
    fontWeight: "600",
  },
  select: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 48,
    backgroundColor: "white",
    zIndex: 1,
  },
  customText: {
    fontWeight: "600",
    fontSize: 15,
  },
  image: {
    // width: "48%",
    height: 100,
    resizeMode: "center",
    marginVertical: 10,
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: SIZES.height * 0.6,
    width: SIZES.width * 0.8,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
