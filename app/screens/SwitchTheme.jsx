import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import ThemeContext from "../context/ThemeContext";
import { darkColors, lightColors } from "../constants/colors";

const SwitchTheme = () => {
  const systemTheme = useColorScheme();
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        theme === "dark" ? darkColors.background : lightColors.background,
    },
    text: {
      color: theme === "dark" ? darkColors.text : lightColors.text,
      marginBottom: 20,
      fontSize: 16,
    },
    button: {
      color: theme === "dark" ? darkColors.icon : lightColors.icon,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.text}>
        Current Theme: {theme}
      </Text>
      <Text allowFontScaling={false} style={styles.text}>
        System Theme: {systemTheme}
      </Text>
      <TouchableOpacity
        onPress={() => toggleTheme("light")}
        style={{
          marginTop: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: theme === "dark" ? "#fff" : "#000",
        }}
      >
        <Text allowFontScaling={false} style={styles.button}>
          Light Theme
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => toggleTheme("dark")}
        style={{
          marginTop: 20,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: theme === "dark" ? "#fff" : "#000",
        }}
      >
        <Text allowFontScaling={false} style={styles.button}>
          Dark Theme
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => useSystemTheme()}
        style={{
          marginTop: 20,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: theme === "dark" ? "#fff" : "#000",
        }}
      >
        <Text allowFontScaling={false} style={styles.button}>
          System Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default SwitchTheme;
