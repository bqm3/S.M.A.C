import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import adjust from "../constants/adjust";


const MultipleScreen = ({ navigation }) => {

  const { authTokenAsset, userAsset, authTokenChecklist, userChecklist } =
    useSelector((state) => state.authReducer);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <BottomSheetModalProvider>
            <ImageBackground
              source={require("../../assets/PMCONE2.png")}
              resizeMode="cover"
              style={styles.defaultFlex}
            >
              <View style={[styles.container]}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  {/* <Image
                    style={{
                      width: adjust(140),
                      height: adjust(80),
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/images/pmc_logo.png")}
                  /> */}
                  {/* <Text style={styles.title}>OUR ECOSYSTEM</Text> */}
                </View>
                <View style={styles.card}>
                  <View style={styles.gridContainer}>
                    <View style={styles.item}>
                      <TouchableOpacity
                        style={styles.itemContent}
                        onPress={() => navigation.navigate("Trang chính")}
                        disabled={userChecklist ? false : true}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            height: adjust(64),
                            width: adjust(64),
                            marginTop: 20,
                          }}
                        >
                          {userChecklist ? (
                            <Image
                              style={{
                                width: adjust(60),
                                height: adjust(60),
                                borderRadius: 20,
                                resizeMode: "contain",
                              }}
                              source={require("../../assets/images/logo_checklist.png")}
                            />
                          ) : (
                            <Image
                              style={{
                                width: adjust(64),
                                height: adjust(64),
                                borderRadius: 20,
                                resizeMode: "contain",
                              }}
                              source={require("../../assets/images/logo_checklist_disable.png")}
                            />
                          )}
                        </View>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: adjust(12),
                            color: "white",
                            paddingTop: 4,
                            fontWeight: "600",
                            textShadowColor: "rgba(0, 0, 0, 0.5)",
                            textShadowOffset: { width: -1, height: 0 },
                            textShadowRadius: 2,
                          }}
                        >
                          {"Checklist"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.item}>
                      <TouchableOpacity
                        style={styles.itemContent}
                        onPress={() => navigation.navigate("PhieuNXScreen")}
                        disabled={userAsset ? false : true}
                      >
                        <View
                          style={{
                            backgroundColor: "white",
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            height: adjust(64),
                            width: adjust(64),
                            marginTop: 20,
                          }}
                        >
                          {userAsset ? (
                            <Image
                              style={{
                                width: adjust(65),
                                height: adjust(65),
                                borderRadius: 20,
                                resizeMode: "contain",
                              }}
                              source={require("../../assets/images/logo_scan.png")}
                            />
                          ) : (
                            <Image
                              style={{
                                width: adjust(65),
                                height: adjust(65),
                                borderRadius: 20,
                                resizeMode: "contain",
                              }}
                              source={require("../../assets/images/logo_scan_disable.png")}
                            />
                          )}
                        </View>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: adjust(12),
                            color: "white",
                            paddingTop: 4,
                            fontWeight: "600",
                            textShadowColor: "rgba(0, 0, 0, 0.5)",
                            textShadowOffset: { width: -1, height: 0 },
                            textShadowRadius: 2,
                          }}
                        >
                          {"Scan Qr"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View></View>
              </View>
            </ImageBackground>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </>
  );
};

export default MultipleScreen;

const styles = StyleSheet.create({
  defaultFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 120,
  },
  title: {
    
    fontSize: adjust(25),
    paddingTop: 20,
    color: "white",
  },
  card: {
    height: adjust(310),
    width: adjust(310),
    borderRadius: 20,
    shadowColor: "#000",
    zIndex: 0,
    backgroundColor: "rgba(255, 255, 255, .3)",
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: "90%",
    height: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "33%",
    height: "auto",
    padding: 4,
  },
  itemContent: {
    height: adjust(80),
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 4,
  },
});
