import React, { useEffect, useState, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  ThucHienChecklist,
  HomeScreen,
  DanhmucCalamviec,
  DanhmucGiamsat,
  DanhmucKhuvuc,
  DetailChecklist,
  DanhmucChecklist,
  DanhmucTracuu,
  DanhmucHangmuc,
  ThucHienHangmuc,
  ThucHienKhuvuc,
  ProfileScreen,
} from "../screens/Checklist";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import LoginScreen from "../screens/LoginScreen";
import ScanScreen from "../screens/QrScan/ScanScreen";
import MultipleScreen from "../screens/MultipleScreen";
import { COLORS } from "../constants/theme";
import adjust from "../constants/adjust";
import { Image, Button, Text, TouchableOpacity, Platform } from "react-native";
import ScanContext from "../context/ScanContext";
import PhieuNXScreen from "../screens/QrScan/PhieuNXScreen";

const Stack = createNativeStackNavigator();

const Back = ({ navigation, title }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        title ? navigation.navigate("Profile") : navigation.goBack()
      }
    >
      <FontAwesome5 name="user-alt" size={adjust(24)} color="white" />
    </TouchableOpacity>
  );
};

const TabNavigation = () => {
  const { step, saveStep } = useContext(ScanContext);
  console.log("run");
  return (
    <>
      <Stack.Navigator
        initialRouteName="MultipleScreen"
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          options={{ headerShown: false }}
          name="MultipleScreen"
          component={MultipleScreen}
        />

        <Stack.Group>
          <Stack.Screen
            name="PhieuNXScreen"
            component={PhieuNXScreen}
            options={({ route, navigation }) => ({
              headerShown: true,
              headerStyle: {
                backgroundColor: COLORS.bg_white,
              },
              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(18),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  Quản lý tài sản
                </Text>
              ),
              headerLeft: () => (
                <Ionicons
                  onPress={() => navigation.goBack()}
                  name="chevron-back"
                  size={adjust(24)}
                  color="black"
                />
              ),
            })}
          />
          <Stack.Screen
            name="ScanScreen"
            component={ScanScreen}
            options={({ route, navigation }) => ({
              headerShown: step === 1 ? true : false,
              headerStyle: {
                backgroundColor: COLORS.bg_white,
              },
              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(18),
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  Quản lý tài sản
                </Text>
              ),
              headerLeft: () => (
                <Ionicons
                  onPress={() => navigation.goBack()}
                  name="chevron-back"
                  size={adjust(24)}
                  color="black"
                />
              ),
            })}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="Trang chính"
            component={HomeScreen}
            lazy={false}
            options={({ route, navigation }) => ({
              headerShown: true,
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(18),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  CHECKLIST
                </Text>
              ),
              headerTitleAlign: "center",
              headerLeft: () => (
                <Image
                  style={{
                    width: adjust(80),
                    height: adjust(40),
                    resizeMode: "contain",
                  }}
                  source={require("../../assets/images/pmc_logo.png")}
                />
              ),
              headerRight: () => (
                <Back navigation={navigation} title={"Profile"} />
              ),
            })}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Thông tin cá nhân
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            name="Thực hiện Checklist"
            component={ThucHienChecklist}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Thực hiện Checklist
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />

          <Stack.Screen
            name="Thực hiện hạng mục"
            component={ThucHienHangmuc}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Hạng mục theo khu vực
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />

          <Stack.Screen
            name="Thực hiện khu vực"
            component={ThucHienKhuvuc}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Khu vực
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />

          <Stack.Screen
             name="Danh mục Hạng mục"
             component={DanhmucHangmuc}
             lazy={false}
             options={({ navigation, route }) => ({
               headerShown: true,
 
               headerTitle: () => (
                 <Text
                   allowFontScaling={false}
                   style={{
                     fontSize: adjust(20),
                     fontWeight: "700",
                     color: "white",
                   }}
                 >
                   Hạng mục
                 </Text>
               ),
               headerLeft: () => (
                 <TouchableOpacity onPress={() => navigation.goBack()}>
                   {Platform.OS === "ios" && (
                     <Ionicons
                       name="chevron-back"
                       size={adjust(28)}
                       color="white"
                     />
                   )}
                 </TouchableOpacity>
               ),
               headerTitleAlign: "center",
               headerStyle: {
                 backgroundColor: COLORS.bg_button,
               },
               headerBackTitleVisible: false,
             })}
           />
          <Stack.Screen
            name="Danh mục Khu vực"
            component={DanhmucKhuvuc}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Danh mục Khu vực
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            name="Danh mục Check list"
            component={DanhmucChecklist}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Danh mục Check list
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            name="Danh mục Giám sát"
            component={DanhmucGiamsat}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Danh mục Giám sát
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />

          <Stack.Screen
            name="Danh mục Ca làm việc"
            component={DanhmucCalamviec}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Danh mục Ca làm việc
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />

          {/* <Stack.Screen
         name="Danh mục tòa nhà"
         component={DanhmucToanhaScreen}
         lazy={false}
         options={({ navigation, route }) => ({
           headerShown: true,
 
           headerTitle: () => (
             <Text allowFontScaling={false}
               
               style={{ fontSize: adjust(20), fontWeight: "700", color: "white" }}
             >
               Danh mục tòa nhà
             </Text>
           ),
           headerLeft: () => (
             <TouchableOpacity onPress={() => navigation.goBack()}>
               {Platform.OS === "ios" && (
                 <Ionicons name="chevron-back" size={adjust(28)} color="white" />
               )}
             </TouchableOpacity>
           ),
           headerTitleAlign: "center",
           headerStyle: {
             backgroundColor: COLORS.bg_button,
           },
           headerBackTitleVisible: false,
         })}
       />
 
       <Stack.Screen
         name="Quản lý người dùng"
         component={DanhmucUserScreen}
         lazy={false}
         options={({ navigation, route }) => ({
           headerShown: true,
 
           headerTitle: () => (
             <Text allowFontScaling={false}
               
               style={{ fontSize: adjust(20), fontWeight: "700", color: "white" }}
             >
               Quản lý người dùng
             </Text>
           ),
           headerLeft: () => (
             <TouchableOpacity onPress={() => navigation.goBack()}>
               {Platform.OS === "ios" && (
                 <Ionicons name="chevron-back" size={adjust(28)} color="white" />
               )}
             </TouchableOpacity>
           ),
           headerTitleAlign: "center",
           headerStyle: {
             backgroundColor: COLORS.bg_button,
           },
           headerBackTitleVisible: false,
         })}
       />
       <Stack.Screen
         name="Danh mục dự án"
         component={DanhmucDuanScreen}
         lazy={false}
         options={({ navigation, route }) => ({
           headerShown: true,
 
           headerTitle: () => (
             <Text allowFontScaling={false}
               
               style={{ fontSize: adjust(20), fontWeight: "700", color: "white" }}
             >
               Danh mục dự án
             </Text>
           ),
           headerLeft: () => (
             <TouchableOpacity onPress={() => navigation.goBack()}>
               {Platform.OS === "ios" && (
                 <Ionicons name="chevron-back" size={adjust(28)} color="white" />
               )}
             </TouchableOpacity>
           ),
           headerTitleAlign: "center",
           headerStyle: {
             backgroundColor: COLORS.bg_button,
           },
           headerBackTitleVisible: false,
         })}
       /> */}

          <Stack.Screen
            name="Tra cứu"
            component={DanhmucTracuu}
            lazy={false}
            options={({ navigation, route }) => ({
              headerShown: true,

              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Thống kê và tra cứu
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />

          <Stack.Screen
            name="Chi tiết Checklist"
            component={DetailChecklist}
            lazy={false}
            options={({ route, navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: adjust(20),
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Chi tiết Checklist
                </Text>
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-back"
                      size={adjust(28)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              ),
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: COLORS.bg_button,
              },
              headerBackTitleVisible: false,
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

export default TabNavigation;
