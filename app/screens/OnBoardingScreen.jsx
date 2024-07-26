import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
} from "react-native";
import React, { useEffect } from "react";

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const OnBoardingScreen = ({ navigation }) => {

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Simulate resource loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigation.replace('LoginScreen');
        console.log('run')
      } catch (error) {
        console.error('Failed to load resources', error);
      }
    };

    loadResources();
  }, []);
  return (
    <HideKeyboard>
      <ImageBackground
        source={require("../../assets/Splash.png")}
        resizeMode="cover"
        style={styles.defaultFlex}
      >
       
      </ImageBackground>
    </HideKeyboard>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  defaultFlex: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
});
