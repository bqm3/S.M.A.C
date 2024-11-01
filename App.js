import React from "react";
import { StatusBar, View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store } from "./app/redux/store";
import { ThemeProvider } from "./app/context/ThemeContext";
import CheckNavigation from "./app/navigation/CheckNavigation";
import { UserProvider } from "./app/context/UserContext";
import { DataProvider } from "./app/context/DataContext";
import { ScanProvider } from "./app/context/ScanContext";
import { AppProvider } from "./app/context/AppContext";
import { ChecklistProvider } from "./app/context/ChecklistContext";

import { PaperProvider } from "react-native-paper";

// // require("moment/locale/vi");

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider>
          <UserProvider>
            <ScanProvider>
              <AppProvider>
              <DataProvider>
                <ChecklistProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <NavigationContainer>
                    <StatusBar />
                    <CheckNavigation />
                  </NavigationContainer>
                  </GestureHandlerRootView>
                </ChecklistProvider>
              </DataProvider>
              </AppProvider>
            </ScanProvider>
          </UserProvider>
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
